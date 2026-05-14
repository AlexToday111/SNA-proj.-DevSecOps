<h1 align="center">Backend</h1>

The `backend` directory contains the Go/Golang application code used by the DevSecOps demonstration. It is split into two variants so the CI/CD pipeline can show both outcomes: secure code passing the security gate and vulnerable code being blocked by automated checks.

<h2 align="center">Directory Content</h2>

```text
backend/
├── README.md
├── safe/
│   ├── go.mod
│   ├── main.go
│   ├── main_test.go
│   ├── Dockerfile
│   └── .dockerignore
└── unsafe/
    ├── go.mod
    ├── go.sum
    └── main.go
```

<h2 align="center">Backend Variants</h2>

| Variant | Purpose | Expected pipeline result |
| --- | --- | --- |
| `safe` | Secure Go HTTP service created as the passing backend scenario. | Tests, SAST, Docker build, and image scan should pass. |
| `unsafe` | Intentionally vulnerable Go service created for the blocked SAST scenario. | SAST should detect vulnerabilities and block the pipeline. |

The `safe` variant is assigned to Nikita Khripunkov. The `unsafe` variant is used as the insecure demonstration case.

<h2 align="center">Safe Backend</h2>

The safe backend is a minimal HTTP API implemented with the Go standard library. It avoids the unsafe patterns demonstrated by the vulnerable version:

- no hardcoded access keys or passwords;
- no execution of user input as shell commands;
- token generation uses `crypto/rand` instead of predictable `math/rand`;
- request bodies are size-limited;
- JSON input is validated and errors are handled explicitly;
- the final Docker image uses a minimal `scratch` runtime image and a non-root user.

<h3 align="center">Endpoints</h3>

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/health` | Returns service health status. |
| `GET` | `/api/status` | Returns service name, version, mode, and uptime. |
| `GET` | `/token` | Returns a URL-safe random token generated with `crypto/rand`. |
| `POST` | `/echo` | Accepts JSON and returns the message without executing it. |

Example request body for `/echo`:

```json
{
  "message": "hello from safe backend"
}
```

<h3 align="center">Run Locally</h3>

```bash
cd backend/safe
go run .
```

The service listens on `:8080` by default. To use another address:

```bash
APP_ADDR=:9090 go run .
```

<h3 align="center">Test</h3>

```bash
cd backend/safe
go test ./...
go vet ./...
```

<h3 align="center">Docker</h3>

```bash
cd backend/safe
docker build -t devsecops-safe-backend .
docker run --rm -p 8080:8080 devsecops-safe-backend
```

<h2 align="center">Unsafe Backend</h2>

The unsafe backend intentionally contains insecure code patterns for the SAST blocking scenario, including:

- hardcoded secret value;
- command execution based on user-controlled input;
- predictable token generation using a fixed `math/rand` seed;
- ignored file creation error;
- unsafe type assertion that can panic.

This service should not be deployed. Its purpose is to provide a clear vulnerable source-code example for the DevSecOps pipeline.

<h2 align="center">Role in the CI/CD Pipeline</h2>

The backend supports the project flow:

```text
Developer push
  -> GitHub Actions
  -> Go tests and source code analysis
  -> Docker image build
  -> Trivy image scan
  -> Security gate pass or block
  -> Results logged and displayed
```

The safe backend represents the successful path. The unsafe backend represents the SAST failure path where the pipeline must stop before deployment.
