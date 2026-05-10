<h1 align="center">Documentation</h1>

The `docs` directory contains the project documentation area for the Secure DevOps Pipeline for Containerized Application. This part of the repository is connected to the documentation and CI/CD pipeline responsibility assigned to Ernest Kudakaev, and it explains the architectural, security, and demonstration decisions behind the project foundation.

<h2 align="center">Directory Content</h2>

This directory contains the explanatory documentation layer for the project. It is used to describe how the team responsibilities, application components, pipeline stages, security tools, and demonstration evidence fit together in a single DevSecOps project.

The documentation area connects the backend work assigned to Zakhar Bolshakov and Nikita Khripunkov, the frontend and design work assigned to Masha Chagodaeva, and the documentation and pipeline work assigned to Ernest Kudakaev.

<h2 align="center">Documentation Content</h2>

Architecture overview describes the main components of the project and how the frontend, Go/Golang backend, GitHub repository, CI/CD pipeline, security tools, and monitoring layer relate to each other.

CI/CD pipeline design explains how GitHub Actions can coordinate source code analysis, container image creation, vulnerability scanning, security gates, and delivery decisions.

Security scanning strategy describes the role of Static Application Security Testing, dependency analysis, container image scanning, and security gates in the project design. It also explains why findings with critical severity are treated as blocking conditions.

Logging and monitoring concept explains how security-related events, scan outcomes, failed gates, and delivery decisions can be collected and reviewed through a centralized monitoring approach.

Demonstration scenarios describe how the project can show successful delivery of secure changes, blocked insecure source code, and blocked vulnerable container images. These scenarios connect the backend service, pipeline checks, and monitoring evidence into one DevSecOps demonstration flow.

Results and screenshots provide supporting evidence for the project demonstration, including pipeline results, scan outputs, and monitoring views when applicable. This documentation area is intended to keep explanation, evidence, and project presentation materials separate from application implementation files.
