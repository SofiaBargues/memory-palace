<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Memory Palace app. PostHog is initialized client-side via a `PHProvider` component (Next.js 14 App Router pattern) that wraps the root layout. A reverse proxy is configured in `next.config.mjs` routing `/ingest/*` to the EU PostHog ingestion endpoint, improving reliability against tracking blockers. A server-side PostHog client (`src/lib/posthog-server.ts`) is wired into the palace generation API route so critical backend events are captured even when the client is unavailable. The client's `distinct_id` is forwarded via `x-posthog-distinct-id` header so client and server events correlate to the same user.

| Event name | Description | File |
|---|---|---|
| `palace_generated` | Server-side: palace successfully created and saved | `src/app/api/v1/generate/route.ts` |
| `palace_generation_failed` | Server-side: palace generation failed with error | `src/app/api/v1/generate/route.ts` |
| `word_category_selected` | User selects a word category to begin building their palace | `src/components/steps/chooseWordsStep.tsx` |
| `palace_generate_clicked` | User clicks Generate Palace with valid words entered | `src/components/steps/chooseWordsStep.tsx` |
| `palace_story_slide_advanced` | User advances to the next scene slide in the palace story | `src/components/steps/storyStep.tsx` |
| `palace_story_completed` | User clicks Complete on the last slide of the palace story | `src/components/steps/storyStep.tsx` |
| `memory_test_started` | User clicks Start Test to begin the timed memory recall test | `src/components/steps/memoryTestStep.tsx` |
| `memory_test_completed` | User submits answers and sees their score (includes score, time, word count) | `src/components/steps/memoryTestStep.tsx` |
| `create_palace_cta_clicked` | User clicks Create a Palace on the homepage hero | `src/components/hero.tsx` |
| `choose_palace_cta_clicked` | User clicks Choose a palace on the homepage hero | `src/components/hero.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://eu.posthog.com/project/211394/dashboard/778909)
- [Palace creation funnel](https://eu.posthog.com/project/211394/insights/4MxWjv5R) — 4-step funnel: word selection → generate clicked → palace generated → test completed
- [Palace generations over time](https://eu.posthog.com/project/211394/insights/p0Wldlj1) — daily volume of successfully generated palaces
- [Memory test scores](https://eu.posthog.com/project/211394/insights/HhDFICxQ) — average score percentage from memory tests over time
- [Homepage CTA clicks](https://eu.posthog.com/project/211394/insights/BQDHEhNX) — Create a Palace vs Choose a Palace engagement
- [Word category preferences](https://eu.posthog.com/project/211394/insights/UzJK0ZmR) — breakdown of which categories users choose most

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify in PostHog error tracking.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
