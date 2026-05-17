# Project Documentation

This document explains Ernest's DevSecOps contribution to the project: CI/CD automation, security scanning, security gates, monitoring integration, and presentation guidance.

## Project Purpose

The project demonstrates a secure delivery workflow for a small containerized application. The goal is not to build a production platform, but to show how a team can integrate security checks into normal development instead of treating security as a separate final step.

The repository contains two backend examples:

- `backend/safe`: secure Go service used for the successful pipeline.
- `backend/unsafe`: intentionally vulnerable Go service used only for security demonstration.

## DevSecOps Explanation

DevSecOps means adding security controls into the same workflow that already builds, tests, and delivers software. In this project, GitHub Actions acts as the automation engine. Every relevant code change can run tests, static security analysis, container image scanning, and security gate logic before the application is considered safe to deliver.

The important idea for the presentation is simple:

- secure code should pass automatically
- vulnerable code should produce clear findings
- serious findings should block delivery
- reports should be stored for review and monitoring

## CI/CD Pipeline Stages

The workflow file is located at:

```text
.github/workflows/devsecops.yml
```

It runs on:

- `push` to `main`
- `pull_request` to `main`
- manual `workflow_dispatch`

Pipeline stages:

1. Checkout the repository.
2. Setup Go using the backend module version.
3. Download Go dependencies.
4. Run tests for `backend/safe`.
5. Run `go vet` for `backend/safe`.
6. Install gosec.
7. Run gosec SAST for `backend/safe`.
8. Run gosec SAST for `backend/unsafe`.
9. Build a Docker image from `backend/safe`.
10. Run Trivy against the safe backend image.
11. Apply security gates.
12. Upload JSON reports as GitHub Actions artifacts.

## SAST With gosec

gosec is used for Static Application Security Testing because the backend is written in Go and gosec is easy to run in CI.

The workflow scans both backend variants:

- `backend/safe` must have zero gosec findings.
- `backend/unsafe` is expected to produce findings.

The unsafe backend intentionally includes insecure patterns such as:

- hardcoded secret-like value
- predictable random number generation
- command execution through a shell
- weak error handling around file creation

The unsafe scan is educational evidence. It proves that the security tool detects risky code patterns before they reach deployment.

## Trivy Image Scanning

Trivy scans the Docker image built from `backend/safe`.

The workflow exports a JSON report and also prints HIGH and CRITICAL findings in the GitHub Actions logs. The security gate is configured to fail the safe delivery path if Trivy finds HIGH or CRITICAL vulnerabilities.

The safe backend Docker image uses a multi-stage build and a minimal final image, which reduces the number of operating system packages and therefore reduces the container attack surface.

## Security Gate Logic

The project has two clear gate paths.

Safe delivery gate:

- tests must pass
- `go vet` must pass
- safe backend gosec findings must be zero
- Trivy must not find HIGH or CRITICAL image vulnerabilities

Unsafe demonstration gate:

- unsafe backend is scanned by gosec
- findings are printed and saved
- manual `scenario=unsafe` or `scenario=all` intentionally fails the job

This design keeps normal CI useful while still allowing a live failed-pipeline demonstration.

## Reports and Artifacts

GitHub Actions uploads security reports as artifacts:

- `reports/gosec-safe.json`
- `reports/gosec-unsafe.json`
- `reports/trivy-safe-image.json`

These files are suitable for:

- reviewing findings after a CI run
- storing evidence for the university project
- importing into the monitoring stack
- showing security gate decisions during presentation

## ELK Monitoring Integration

The monitoring stack is defined in:

```text
docker-compose.monitoring.yml
```

It uses a lightweight ELK setup:

- Elasticsearch stores scan documents.
- Logstash reads JSON files from `reports/`.
- Kibana provides a dashboard interface.

Logstash configuration is stored in:

```text
monitoring/logstash/pipeline/devsecops-reports.conf
```

The pipeline labels reports by scanner type:

- gosec reports contain `Issues`
- Trivy reports contain `Results`

This is a simplified local integration. In production, a team would normally send CI events and security findings to a centralized SIEM with authentication, retention policies, alerting, and access control.

## How to Run Locally

Run safe backend checks:

```bash
cd backend/safe
go mod download
go test ./...
go vet ./...
```

Run gosec locally after installing it:

```bash
go install github.com/securego/gosec/v2/cmd/gosec@latest
mkdir -p ../../reports
gosec -fmt=json -out=../../reports/gosec-safe.json ./...
```

Build the safe backend image:

```bash
docker build -t devsecops-safe-backend:local backend/safe
```

Scan the image with Trivy:

```bash
trivy image --format json --output reports/trivy-safe-image.json devsecops-safe-backend:local
trivy image --severity HIGH,CRITICAL --exit-code 1 devsecops-safe-backend:local
```

Start monitoring:

```bash
docker compose -f docker-compose.monitoring.yml up
```

Open Kibana:

```text
http://localhost:5601
```

## How to Trigger GitHub Actions

Normal safe scenario:

1. Push to `main` or open a pull request targeting `main`.
2. Open the GitHub Actions tab.
3. Select the `DevSecOps Pipeline` workflow.
4. Review the safe backend test, SAST, Docker build, and Trivy stages.
5. Download artifacts from the workflow run.

Unsafe scenario:

1. Open the GitHub Actions tab.
2. Select `DevSecOps Pipeline`.
3. Choose `Run workflow`.
4. Set `scenario` to `unsafe` or `all`.
5. Start the run.
6. Show that gosec detects the unsafe backend and the unsafe security gate fails intentionally.

## Safe Demo Scenario

Use this explanation during presentation:

1. A developer pushes secure code.
2. GitHub Actions starts automatically.
3. Tests and `go vet` validate code quality.
4. gosec checks the safe backend and finds no issues.
5. Docker builds the safe backend image.
6. Trivy scans the image.
7. No blocking vulnerabilities are found.
8. The security gate passes.
9. Reports are uploaded as artifacts.

## Unsafe Demo Scenario

Use this explanation during presentation:

1. The repository also contains `backend/unsafe`.
2. This backend is intentionally vulnerable and is not used for deployment.
3. gosec scans it and reports risky patterns.
4. A manual unsafe workflow run activates the unsafe gate.
5. The pipeline fails intentionally.
6. The failed run proves that vulnerable code can be detected and blocked by CI/CD.

## Presentation Talking Points

Recommended explanation order:

1. Show repository structure and team responsibilities.
2. Show the safe and unsafe backend folders.
3. Open `.github/workflows/devsecops.yml`.
4. Explain tests, go vet, SAST, Docker build, Trivy, and artifacts.
5. Run or show a successful safe workflow.
6. Run or show an unsafe manual workflow that fails.
7. Download JSON reports from Actions.
8. Start the ELK stack locally and explain how reports are ingested.
9. Connect the result to DevSecOps principles: shift-left security, automated gates, audit evidence, and monitoring.

## Limitations and Simplifications

This is a university demonstration, so several choices are intentionally simplified:

- ELK is configured without production authentication.
- Reports are file-mounted locally instead of streamed from GitHub Actions to a remote SIEM.
- The unsafe backend is deliberately vulnerable and must not be deployed.
- The pipeline focuses on Go SAST and container scanning, not full dependency governance.
- The security gate uses clear severity thresholds instead of a complex risk model.
- The monitoring stack is local and intended for presentation, not long-term operations.

These simplifications keep the project understandable while still demonstrating real DevSecOps practices.
