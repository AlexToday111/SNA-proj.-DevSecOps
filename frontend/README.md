<h1 align="center">Frontend - DevSecOps Pipeline Dashboard</h1>

Interactive single-page application that visualizes the secure CI/CD flow described in the project: push to GitHub, GitHub Actions, SAST (Semgrep), Docker build, Trivy image scan, security gate, deployment or block, and streamed-style security event logs.

The pipeline scenarios in `src/data/scenarios.js` are scripted demo data. The separate **Live Safe Backend API** panel can call the real Go service in `backend/safe` when it is running locally.

<h2 align="center">Features</h2>

- Three selectable scenarios aligned with the root README: **secure path**, **SAST block**, **Trivy block**.
- Step-by-step pipeline animation with per-stage status (success, failed, skipped, blocked).
- Cards for **SAST** and **Trivy** summaries with sample findings.
- **Security event log** panel with sequential streaming lines during replay.
- **Replay** control for the active scenario.
- Dark, GitHub-inspired UI implemented with plain CSS (no UI kit).

<h2 align="center">Tech Stack</h2>

| Area | Choice |
| --- | --- |
| Runtime | React 18 |
| Bundler / dev server | Vite 5 |
| Styling | Custom CSS (`src/index.css`) |
| Production serve | Multi-stage Docker image -> nginx Alpine |

<h2 align="center">Requirements</h2>

- **Node.js** 18 or newer (LTS recommended)
- **npm** (ships with Node)

<h2 align="center">Repository Layout</h2>

```text
frontend/
|-- README.md
|-- Dockerfile
|-- .dockerignore
|-- package.json
|-- package-lock.json
|-- vite.config.js          # dev server port 3000, proxy /backend to safe backend :8080
|-- index.html
`-- src/
    |-- main.jsx            # React root
    |-- App.jsx             # scenario state, animation timings
    |-- index.css           # layout, tokens, components
    |-- assets/
    |   `-- project-logo.png
    |-- data/
    |   `-- scenarios.js    # steps, logs, SAST/Trivy payloads, outcomes
    |-- api/
    |   `-- backend.js      # live safe backend client
    `-- components/
        |-- Header.jsx
        |-- BackendPanel.jsx
        |-- ScenarioSelector.jsx
        |-- PipelineFlow.jsx
        |-- ScanResults.jsx
        |-- EventLogs.jsx
        `-- Icons.jsx
```

<h2 align="center">Scripts</h2>

| Command | Description |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Development server with HMR - http://localhost:3000 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Local preview of the production build |

<h2 align="center">Run Locally</h2>

Run the safe backend first if you want the live API panel to show online status:

```bash
cd backend/safe
go run .
```

Then run the frontend:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 in a browser.

<h2 align="center">Docker</h2>

From this directory:

```bash
docker build -t devsecops-frontend .
docker run --rm -p 3000:80 devsecops-frontend
```

The app is served on http://localhost:3000 (container port 80 mapped to host 3000).

<h2 align="center">Demonstration Scenarios</h2>

| # | Label | What it shows |
| --- | --- | --- |
| 1 | Secure Code | Safe backend path passes tests, SAST, image scan, and deployment. |
| 2 | Insecure Code | SAST fails on patterns from `backend/unsafe/main.go` (`/exec`, hardcoded `AccessKey`, weak `/token` RNG); build/Trivy skipped; gate blocks deploy. |
| 3 | Vulnerable Image | A sample Trivy result contains critical CVEs; gate blocks deploy. |

Selecting a scenario runs the animation. **Replay** repeats it for the current selection.

<h2 align="center">Integration Notes</h2>

- **Live backend:** run `backend/safe` on port `8080`. With `npm run dev`, Vite proxies `/backend/*` to `http://127.0.0.1:8080/*`.
- **Frontend API calls:** `src/api/backend.js` calls `GET /health`, `GET /api/status`, `GET /token`, and `POST /echo` through the `/backend` prefix.
- **Unsafe backend:** `backend/unsafe` exists for the scripted SAST failure scenario. The UI does not call `POST /exec`.
- **Production API:** the nginx Docker image serves static files only. For production, either add an nginx reverse proxy for `/backend/*` or set `VITE_API_PREFIX` to a reachable backend origin and enable CORS on the backend.
- **CI/CD:** pipeline YAML is expected at the repository root under `.github/workflows/` (see team documentation). The dashboard does not consume Actions artifacts out of the box.

<h2 align="center">Browser Support</h2>

Modern evergreen browsers (Chrome, Firefox, Safari, Edge) with ES modules support.
