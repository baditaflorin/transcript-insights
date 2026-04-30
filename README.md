# Transcript Insights

> **AI-powered transcript analysis tool.** Paste or upload any conversation transcript and instantly extract summaries, action items, decisions, timelines, sentiment, risks, opportunities, and more — using your own Google Gemini or OpenAI API key.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Docker](https://img.shields.io/badge/Docker-ready-blue)](./Dockerfile)

---

## ✨ Features

- 🧠 **12 analysis types** — Summary, Action Items, Decisions, Timeline, Risks, Opportunities, Sentiment, Perspectives, Stakeholders, Knowledge Gaps, Communication Patterns, Open Questions
- 🔀 **Multi-provider** — Google Gemini (default) or OpenAI GPT-4o-mini
- 🔑 **Bring your own API key** — entered in the UI, stored only in `localStorage`, never sent to any server other than the AI provider
- 📥 **Download results** — individual Markdown files or a single bundled file
- 🐳 **Docker ready** — one command to run anywhere

---

## 🚀 Quickstart

### Prerequisites
- **Node.js 18+** (check: `node -v`)
- A [Google AI](https://aistudio.google.com/app/apikey) or [OpenAI](https://platform.openai.com/api-keys) API key

### Run locally

```bash
git clone https://github.com/baditaflorin/transcript-insights.git
cd transcript-insights
npm install
npm run dev
```

Open [http://localhost:9002](http://localhost:9002), enter your API key in the UI, paste a transcript, and click **Analyze**.

### Run with Docker

```bash
git clone https://github.com/baditaflorin/transcript-insights.git
cd transcript-insights
docker-compose up --build
```

Open [http://localhost:4322](http://localhost:4322).

> **No environment variables are required to run the app.** API keys are entered in the browser UI.

---

## 🗂️ Project Structure

```
src/
├── ai/
│   ├── flows/
│   │   ├── prompts/          # One file per analysis type (DRY)
│   │   ├── dynamic-analysis-flow.ts
│   │   ├── generate-filename-flow.ts
│   │   └── utils.ts          # configureAi() — provider/key wiring
│   └── dev.ts                # Genkit dev server entry
├── app/
│   ├── actions.ts            # Next.js Server Actions
│   ├── page.tsx
│   └── layout.tsx
├── components/
│   ├── app/                  # Feature components
│   └── ui/                   # shadcn/ui primitives
├── hooks/
└── lib/
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| AI Orchestration | [Firebase Genkit](https://firebase.google.com/docs/genkit) |
| AI Providers | Google Gemini 1.5 Flash, OpenAI GPT-4o-mini |
| UI | [shadcn/ui](https://ui.shadcn.com/) + Tailwind CSS |
| Validation | [Zod](https://zod.dev/) |
| Containerization | Docker + Docker Compose |

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss changes.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Open a Pull Request

---

## 📄 License

[MIT](./LICENSE) — © 2025 [Florin Badita](https://linkedin.com/in/baditaflorin)

Built with ❤️ using [Firebase Studio](https://firebase.google.com/studio) and [scrapetheworld.org](https://scrapetheworld.org).
