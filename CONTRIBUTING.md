# Contributing to Transcript Insights

Thank you for your interest in contributing! 🎉

## Getting Started

1. **Fork** the repository and clone your fork locally
2. Install dependencies: `npm install`
3. Run the dev server: `npm run dev`
4. Open [http://localhost:9002](http://localhost:9002)

## Development Workflow

- **Lint**: `npm run lint`
- **Type check**: `npm run typecheck`
- **Build**: `npm run build`

## Code Style

- Small, focused files — one responsibility per module (see `src/ai/flows/prompts/`)
- DRY and SOLID principles throughout
- TypeScript strict mode — no `any` types
- All new AI analysis types go in their own file under `src/ai/flows/prompts/`

## Adding a New Analysis Type

1. Create `src/ai/flows/prompts/<your-type>.ts` — define the Zod schema and Genkit prompt
2. Export from `src/ai/flows/prompts/index.ts`
3. Add to `AnalysisType` enum in `prompts/index.ts`
4. Register in `src/ai/flows/dynamic-analysis-flow.ts`
5. Add display config in `src/lib/analysis-config.ts`

## Pull Request Guidelines

- Keep PRs focused — one feature or fix per PR
- Add a clear description of what changed and why
- Ensure `npm run typecheck` and `npm run lint` pass before submitting

## Reporting Issues

Please open a GitHub issue with:
- A clear title
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS version

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
