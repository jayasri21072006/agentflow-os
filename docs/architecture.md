# Architecture Overview

This repository uses a simple frontend-to-workflow architecture:

Frontend (React + Vite)
↓
n8n Router
↓
AI Agent Execution
↓
Gemini API (configured in n8n)
↓
Response Display

The dashboard reads runtime values from environment variables such as VITE_N8N_WEBHOOK_URL.
