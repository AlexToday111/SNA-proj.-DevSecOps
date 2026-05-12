<h1 align="center">Frontend — DevSecOps Pipeline Dashboard</h1>

Interactive single-page application that visualizes the secure CI/CD flow described in the project: push to GitHub, GitHub Actions, SAST (Semgrep), Docker build, Trivy image scan, security gate, deployment or block, and streamed-style security event logs.

The dashboard uses **static demonstration data** (`src/data/scenarios.js`). It does not call the Go backend or live CI APIs; it complements the pipeline narrative for presentations and coursework.

<h2 align="center">Features</h2>

- Three selectable scenarios aligned with the root README: **secure path**, **SAST block**, **Trivy block**.
- Step-by-step pipeline animation with per-stage status (success, failed, skipped, blocked).
- Cards for **SAST** and **Trivy** summaries with realistic sample findings.
- **Security event log** panel with sequential “streaming” lines during replay.
- **Replay** control for the active scenario.
- Dark, GitHub-inspired UI implemented with plain CSS (no UI kit).

<h2 align="center">Tech Stack</h2>

| Area | Choice |
| --- | --- |
| Runtime | React 18 |
| Bundler / dev server | Vite 5 |
| Styling | Custom CSS (`src/index.css`) |
| Production serve | Multi-stage Docker image → nginx Alpine |

<h2 align="center">Requirements</h2>

- **Node.js** 18 or newer (LTS recommended)
- **npm** (ships with Node)

<h2 align="center">Repository Layout</h2>

```text
frontend/
├── README.md
├── Dockerfile             
├── .dockerignore
├── package.json
├── package-lock.json
├── vite.config.js          # dev server port 3000, host 0.0.0.0
├── index.html
└── src/
    ├── main.jsx            # React root
    ├── App.jsx             # scenario state, animation timings
    ├── index.css           # layout, tokens, components
    ├── assets/
    │   └── project-logo.png
    ├── data/
    │   └── scenarios.js    # steps, logs, SAST/Trivy payloads, outcomes
    └── components/
        ├── Header.jsx
        ├── ScenarioSelector.jsx
        ├── PipelineFlow.jsx
        ├── ScanResults.jsx
        ├── EventLogs.jsx
        └── Icons.jsx       # inline SVG icons for tools and steps
```

<h2 align="center">Scripts</h2>

| Command | Description |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Development server with HMR — http://localhost:3000 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Local preview of the production build |

<h2 align="center">Run Locally</h2>

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
| 1 | Secure Code | All stages green; deploy succeeds. |
| 2 | Insecure Code | SAST fails (e.g. SQLi, hardcoded secret, XSS pattern); build/Trivy skipped; gate blocks deploy. |
| 3 | Vulnerable Image | SAST passes; Trivy fails on critical CVEs; gate blocks deploy. |

Selecting a scenario runs the animation; **Replay** repeats it for the current selection.

<h2 align="center">Integration Notes</h2>

- **Backend:** not required for the UI to run. To attach real APIs later, introduce a base URL (for example `import.meta.env.VITE_API_BASE_URL`), fetch JSON shaped like the objects in `scenarios.js`, and keep a fallback to local data during development.
- **CI/CD:** pipeline YAML is expected at the repository root under `.github/workflows/` (see team documentation). The dashboard does not consume Actions artifacts out of the box.

<h2 align="center">Browser Support</h2>

Modern evergreen browsers (Chrome, Firefox, Safari, Edge) with ES modules support.
