<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="frontend/public/insightflow-logo-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="frontend/public/insightflow-logo-color.svg">
    <img alt="InsightFlow AI" src="frontend/public/insightflow-logo-color.svg" width="320">
  </picture>
</p>

<p align="center">
  <strong>Turn business questions into actionable insights.</strong><br>
  An AI-powered business intelligence copilot that translates natural-language questions into SQL queries, analyzes business data, generates dynamic visualizations, and delivers context-aware answers.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/InsightFlow_AI-v0.1.0-4F46E5" alt="InsightFlow AI">
  <img src="https://img.shields.io/badge/Python-3.11+-172554?logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/LangGraph-0.2+-orange" alt="LangGraph">
  <img src="https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/License-Apache_2.0-blue" alt="License">
</p>

<p align="center">
  <img src="docs/insightflow-welcome.png" alt="InsightFlow AI Application Interface" width="850">
</p>

---

## 🌟 Overview

**InsightFlow AI** is a professional, enterprise-grade AI copilot designed for business analysts, data analysts, operations teams, and executive decision-makers. It connects directly to your data warehouses (Snowflake, BigQuery, PostgreSQL, MySQL) and enables conversational exploration of complex business metrics.

By translating plain-English questions into performant SQL queries, running them against your database, and rendering interactive Vega-Lite visualizations within a unified turn, InsightFlow AI eliminates the friction between business questions and actionable data insights.

---

## 🚀 Key Features

- **Natural Language to SQL**: Formulate questions in plain English ("Show monthly revenue trends" or "Which product categories generated the highest revenue?") and receive synthesized answers, executable SQL, tabular outputs, and charts simultaneously.
- **Dynamic Visualizations**: Automatically generates Vega-Lite charts (bar charts, line graphs, pie charts, waterfalls) tailored to query results, with one-click high-resolution PNG export.
- **Enterprise Design System**: Modern SaaS UI built around a curated palette (Deep Navy `#172554`, Indigo `#4F46E5`, Light Slate `#F8FAFC`, Crisp Surface `#FFFFFF`) with accessible contrast, typography powered by Inter and JetBrains Mono, and responsive desktop/mobile layouts.
- **Multi-Turn Context & Follow-Ups**: Preserves conversational state for natural follow-ups ("Now filter that by Q3", "Break it down by region", or "Switch to a pie chart").
- **Context-Aware Metadata Integration**: Plugs into catalog metadata (such as DataHub) to leverage table descriptions, glossary terms, ownership, and column tags for higher SQL accuracy and business-aligned explanations.
- **Interactive Execution Transparency**: Collapsible execution steps reveal tool calls, model reasoning, token consumption, and execution duration without cluttering the chat view.
- **Enterprise Warehouses & Connections**: Support for Snowflake (SSO, OAuth, KeyPair, PAT), Google BigQuery, PostgreSQL, and MySQL with encrypted credential persistence and tool-level permissions.
- **Curated Theme System**: Includes default light mode, Midnight Navy dark mode, Warm Amber, and Carbon Dark with immediate real-time switching.

---

## 🏗️ Architecture

InsightFlow AI pairs a modern React + TypeScript single-page application with a high-performance FastAPI and LangGraph backend orchestrator.

```
insightflow-ai/
├── backend/src/analytics_agent/
│   ├── agent/          # LangGraph ReAct graph, streaming SSE, chart generation
│   ├── api/            # FastAPI endpoints: /conversations, /chat, /settings, /oauth
│   ├── context/        # Metadata context provider (DataHub integration)
│   ├── db/             # SQLAlchemy ORM models & Alembic migrations
│   ├── engines/        # Warehouse query engines (Snowflake, BigQuery, PostgreSQL, MySQL)
│   ├── prompts/        # System instructions & chart generation prompts
│   └── skills/         # Context refinement & write-back skills (/improve-context)
└── frontend/src/
    ├── components/
    │   ├── Brand/      # InsightFlowIcon, AppLogo, ThemeSwitcher, Attribution
    │   ├── Chat/       # WelcomeView, MessageList, MessageInput, ContextStatusBar
    │   ├── Onboarding/ # Interactive Setup Wizard
    │   ├── Settings/   # Connections, Model Configuration, Display Settings, About
    │   └── Sidebar/    # Conversations filter, active states, branding
    ├── store/          # Zustand state stores: conversations, theme, display
    └── index.css       # Design tokens, color system, print styles
```

### Request & Streaming Flow
1. **User Question**: Submitted via `MessageInput` or suggested prompt chips on `WelcomeView`.
2. **FastAPI Route**: Received at `POST /api/conversations/{id}/messages`.
3. **Credential Resolution**: Active connection credentials decrypted and attached to the target warehouse engine.
4. **LangGraph Agent**: LangGraph ReAct agent queries metadata context, generates SQL query, executes it safely, and formats visualization specifications.
5. **Server-Sent Events (SSE)**: Streamed in real-time (`TEXT`, `TOOL_CALL`, `SQL`, `CHART`, `USAGE`, `COMPLETE`) to the frontend and virtualized in `MessageList`.

---

## 💻 Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 18, TypeScript, Vite |
| **Styling & Design System** | Tailwind CSS, Custom HSL Design Tokens, Inter & JetBrains Mono Fonts |
| **Data Visualizations** | Vega, Vega-Lite, Vega-Embed |
| **State Management** | Zustand (persistent theme & display stores) |
| **Backend & API** | Python 3.11+, FastAPI, Uvicorn, SSE Starlette |
| **Agent & LLM Framework** | LangChain, LangGraph ReAct Agent |
| **Supported LLMs** | Anthropic Claude (Opus/Sonnet/Haiku), OpenAI (GPT-4o/o1), Google Gemini, AWS Bedrock, OpenAI-Compatible APIs |
| **Data Warehouses** | Snowflake, Google BigQuery, PostgreSQL, MySQL |
| **Metadata Context** | DataHub GMS / DataHub MCP (optional) |

---

## ⚡ Installation & Quickstart

### Prerequisites
- Node.js 18+ and pnpm (for frontend)
- Python 3.11+ and uv or pip (for backend)
- Database credentials for at least one supported warehouse (Snowflake, BigQuery, Postgres, or MySQL)

### 1. Frontend Setup
```bash
cd frontend
pnpm install
pnpm build
```

To run the frontend in development mode with hot-reloading:
```bash
pnpm dev
```

### 2. Backend Setup
```bash
# From project root
uv sync --all-extras
# Or with standard pip:
pip install -e ".[base]"
```

Launch the backend server:
```bash
uv run uvicorn analytics_agent.main:app --host 0.0.0.0 --port 8100 --reload
```

Open your browser at **http://localhost:8100** (or the Vite dev URL at **http://localhost:5173**).

### 3. Setup Wizard
When you first open InsightFlow AI, the setup wizard will guide you through:
1. Confirming your application identity ("InsightFlow AI").
2. Selecting your primary LLM provider (Anthropic, OpenAI, Google Gemini, AWS Bedrock, or custom endpoint) and providing an API key.
3. Adding your database connection in **Settings → Connections**.

---

## 💡 Example Questions & Capabilities

The following queries highlight supported analytical workflows:

- **Revenue & Trends**:
  - *"Which product categories generated the highest revenue?"*
  - *"Show monthly revenue trends."*
  - *"Compare performance across business segments."*
- **Diagnostic & Root Cause**:
  - *"Identify the main factors behind a sales decline."*
  - *"Which customer accounts experienced the highest churn last quarter?"*
- **Operational & Cohort Analytics**:
  - *"What is our average deal size by customer industry?"*
  - *"Break down query execution times across our data pipelines."*

*(Note: Actual query execution depends on tables and schemas present in your connected data warehouse.)*

---

## ⚠️ Known Limitations

- **Complex Multi-Schema Joins**: Requires accurate schema documentation or metadata catalog connection to disambiguate identical column names across disparate schemas.
- **Database Permissions**: InsightFlow AI requires read-only query execution privileges. Destructive operations (DDL/DML mutations) are restricted by default.
- **Chart Complexity**: Charts are generated via Vega-Lite specifications; custom WebGL or 3D visualizations are not supported out of the box.

---

## 📄 Open-Source Attribution & Credits

InsightFlow AI is built upon and extends the open-source **[DataHub Analytics Agent](https://github.com/datahub-project/analytics-agent)** repository developed by Acryl Data and the DataHub open-source community.

- **Original Project**: [DataHub Analytics Agent](https://github.com/datahub-project/analytics-agent)
- **License**: Apache License 2.0 (see [LICENSE](LICENSE) for details).
- **Modifications**: Rebranded user interface, original geometric brand mark, curated SaaS design system (`#172554` Deep Navy, `#4F46E5` Indigo, `#F8FAFC` Light Slate), typography hierarchy, refined SQL and chart presentation cards, and enhanced welcome screen workflows.
- **Disclaimer**: InsightFlow AI is an independent project and is not an official DataHub product or endorsed by Acryl Data.
