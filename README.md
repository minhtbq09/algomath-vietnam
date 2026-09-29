# AlgoMath Vietnam

A free, bilingual learning site that connects Mathematical Olympiad thinking to computer science, written for students in grades 9 to 11.

The premise: students who already know induction, invariants, congruences and counting are not missing a new ability when they meet algorithms. They are missing a second language for what they already understand. Every lesson starts from a familiar mathematics problem and ends with runnable code.

Vietnamese lives at `/vi/`, English at `/en/`.

## What is in here

| | |
| --- | --- |
| Lessons | 20, in Vietnamese and English, grouped into 5 chapters |
| Interactive simulations | 10, all step-forward, step-back and self-explaining |
| Exercises | 44, bilingual, each with a hint and a worked solution |
| Workshops | 3 session plans with agendas and pre/post-test structure |

Every lesson follows the same six steps: an opening problem, the mathematical idea behind it, how that idea becomes an algorithm, a simulation, pseudocode and Python, then exercises.

## Running it locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev      # open http://localhost:3000
npm run build    # writes a static site into out/
```

## Deploying

The site exports to pure static HTML. No server, no database, no user accounts, no running costs. Pick one of two routes.

### Option 1: GitHub Pages

A workflow is already included at `.github/workflows/deploy.yml`.

1. Push the code to GitHub on the `main` branch
2. In the repository, open **Settings** then **Pages**
3. Under **Source**, choose **GitHub Actions** instead of "Deploy from a branch"
4. Wait about two minutes; the site address appears on that same page

Step 3 is the one people miss. Leaving it on "Deploy from a branch" means the workflow runs successfully but the site never updates.

After that, every push to `main` rebuilds the site automatically.

The workflow works out where the site is served from on its own:

| Repository name | Site address | Base path |
| --- | --- | --- |
| `<account>.github.io` | `https://<account>.github.io/` | none |
| any other name | `https://<account>.github.io/<repo>/` | `/<repo>` |

You do not need to act on this table. It is here so the behaviour is not a mystery when you see `/<repo>/` in the URL.

To reproduce a GitHub Pages build locally, replace `algomath-vietnam` with the real repository name:

```bash
# Windows PowerShell
$env:NEXT_PUBLIC_BASE_PATH="/algomath-vietnam"; npm run build

# macOS or Linux
NEXT_PUBLIC_BASE_PATH=/algomath-vietnam npm run build
```

Two files must stay in place. Do not delete either:

- `public/.nojekyll`: without it, GitHub Pages runs Jekyll, which ignores any directory starting with an underscore. That silently removes `_next`, and the site loads as unstyled plain text.
- `.github/workflows/deploy.yml`: the build and deploy pipeline itself.

### Option 2: Vercel
Go to vercel.com, choose Import Project and point it at the repository. Vercel detects Next.js by itself. No configuration, no environment variables. The site sits at the domain root, so there is no sub-path to worry about.

Vercel is slightly simpler and gives a tidier URL. GitHub Pages keeps the source and the live site in one place, which is convenient if you want to manage everything from a single account.

## Editing content

This is the part you will touch regularly. It all lives under `content/` and needs no React knowledge.

| To change | Edit |
| --- | --- |
| A lesson | `content/lessons/<slug>/vi.mdx` and `en.mdx` |
| Exercises | `content/exercises/*.json` |
| Workshop details | `content/workshops/workshops.json` |
| Impact figures | `content/impact.json` |
| Team, advisors, contact | `content/about.json` |
| Lesson titles, order, maths-to-algorithm pairs | `src/lib/curriculum.ts` |
| Button labels, menus, page headings | `src/i18n/dictionary.ts` |
| Exercise topic names in English | `src/i18n/topics.ts` |

See [docs/adding-a-lesson.md](docs/adding-a-lesson.md) for how to add a new lesson.

Lesson files are MDX, meaning ordinary Markdown with a few extras: LaTeX between dollar signs for mathematics, `<Note>…</Note>` for a highlighted aside, and `<Viz name="bfs" />` to embed a simulation.

### Missing translations

If a lesson has no `en.mdx`, the English page falls back to the Vietnamese text with a short notice, rather than returning a 404. All 20 lessons currently have both, but the fallback is still there if you add a lesson and translate it later.

## Project layout

```
content/          lessons, exercises, workshops, impact data
src/algorithms/   pure algorithm logic, no UI
src/components/   shared interface and the simulations
src/app/          pages, organised as [locale]/...
src/i18n/         interface strings in both languages
src/lib/          content loading, curriculum data, path helpers
```

`src/algorithms/` is deliberately isolated. It contains algorithm logic only: no React imports, no knowledge of colours or layout. A technical advisor can read and verify correctness there without knowing any web development, and the files are straightforward to unit-test.

## How the simulations work

An algorithm never runs live on screen. It runs once up front and produces an immutable list of frames. Each frame is a complete snapshot of the state at one step, with a bilingual sentence explaining that step. The `AlgorithmPlayer` component simply changes which frame index is displayed.

Three consequences:

- The Back button is `index - 1`, free, with no need to run anything in reverse
- All 10 simulations behave identically, so students learn the controls once
- Adding an eleventh costs one generator function and one renderer

To add a simulation:

1. Write `src/algorithms/<name>.ts` producing the frames
2. Write `src/components/viz/<Name>Viz.tsx` drawing a single frame
3. Add one entry to `VIZ_REGISTRY` in `src/components/viz/index.tsx`

Then embed it in any lesson with `<Viz name="<name>" />`.

The state colour palette is declared once, as `STATE_COLOR` in `src/algorithms/types.ts`. Changing it there changes all 10 simulations at once.

## Content status

| Item | Done | Notes |
| --- | --- | --- |
| Vietnamese lessons | 20 / 20 | complete |
| English lessons | 20 / 20 | complete |
| Simulations | 10 / 10 | complete |
| Exercises | 44 / 60 | lessons 08, 09, 12, 14, 15 and 18 still have none |

## Measuring impact

The website collects no personal data. Sign-ups and surveys run through external Google Forms.

For pre-tests and post-tests, use an anonymous code pre-printed on the sheet, such as `W1-042`, rather than asking for names. The two papers can then be matched to measure each student's progress without storing anyone's identity. This is worth stating explicitly in the impact report; it is a deliberate research-ethics choice, not an oversight.

For visitor counts, enable Vercel Analytics from the Vercel dashboard, or add Umami. Neither uses cookies.

## Team

Team and advisor details live in `content/about.json` and appear on the About page. Fill in the real names where the file still reads `TÊN NGƯỜI HỖ TRỢ KỸ THUẬT` and `CHƯA XÁC NHẬN` before publishing.

## Tooling note

The website infrastructure, simulation engine and interface were developed with the help of AI tools. The curriculum, lessons and exercises were written by the project team, who are responsible for their content.

If this project is submitted to a competition or programme with rules about AI tool use, read those rules and disclose accordingly.

## Dependency security

The versions in `package.json` were current with published security advisories at handover. If `npm install` later warns that a dependency is deprecated or vulnerable, upgrade that package to its latest patch release and rebuild:

```bash
npm install <package>@latest
npm run build
```

Three remaining `high` findings from `npm audit` come from `postcss` and `sharp`. Both run only at build time on your own machine and appear nowhere in the exported static site, so there is no attack surface. Leave them.

Do **not** run `npm audit fix --force`. That command upgrades Next.js across major versions and will likely break the build.
