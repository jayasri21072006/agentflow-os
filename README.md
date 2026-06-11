# AgentFlow OS

A sleek AI-agent command center built with React + Vite and routed through an n8n workflow export.

![AgentFlow OS dashboard](screenshots/Screenshot%20(674).png)

## Why this project stands out

- Launch a polished AI dashboard in minutes
- Route requests through a reusable n8n workflow
- Keep the frontend and workflow export clean for GitHub sharing
- Use simple environment-based configuration for webhook setup

## What is in this repository

This workspace currently contains:
- a frontend app in `frontend/`
- a sanitized workflow export in `workflows/ai-router.json`
- a full workflow backup in `full_worflow.json`
- repo notes in `docs/architecture.md`
- screenshots and assets in `screenshots/`

## Current structure

project-root/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── workflows/
│   └── ai-router.json
├── docs/
│   └── architecture.md
├── screenshots/
├── full_worflow.json
├── .env.example
├── .gitignore
├── LICENSE
└── README.md

## Features

- Interactive AI-agent cards in the dashboard
- n8n webhook-based execution flow
- Responsive React UI
- Environment-variable based webhook setup
- Public-ready folder layout for GitHub sharing

## Tech stack

- React 19
- Vite 8
- JavaScript / JSX
- n8n workflow export

## Quick start

1. Install frontend dependencies:
   cd frontend
   npm install
2. Create your local environment file from the template:
   copy ..\.env.example ..\.env
3. Fill in your values in the root `.env` file:
   - `VITE_N8N_WEBHOOK_URL` for the dashboard webhook input
4. Start the dashboard:
   npm run dev

## Build for production

From `frontend/`:

npm run build

> Note: Vite 8 requires Node.js 20.19+ or 22.12+.

## Environment variables

Use the root `.env` file for these variables:

VITE_N8N_WEBHOOK_URL=

No OpenAI API key is required for the current workflow export. The Gemini endpoints are configured inside n8n.

## Workflow usage

1. Import `workflows/ai-router.json` into n8n.
2. Replace placeholder credentials in the workflow with your real API keys inside n8n.
3. Set the same webhook URL in the root `.env` file used by the frontend.

## Notes

- `full_worflow.json` is kept as a reference copy of the original export.
- The sanitized workflow in `workflows/ai-router.json` is the publishable version for GitHub.
- Keep secrets in `.env` and do not commit real credentials.

## License

This repository currently includes `LICENSE` for project distribution. Update the license text if you plan to publish it under a different open-source term.
