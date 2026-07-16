# print-more

Web app for bulk-generating and printing Vietnamese **BBBG** (Biên bản bàn giao —
device-handover records) from an uploaded Excel file. All feature logic lives in
`src/features/bbbg/` — see that directory's `CLAUDE.md` for the domain rules.

## Stack

- React 19 + TypeScript (strict), built with Vite 8.
- React Compiler is enabled (via `@rolldown/plugin-babel` in `vite.config.ts`).
- Tailwind CSS v4 (`@tailwindcss/vite`) is the primary styling convention; all
  component styles are applied via utility classes in JSX. Print-specific styles
  (exact millimeter dimensions, `@page` rules, `@media print` blocks) that cannot
  be expressed in Tailwind remain as minimal custom CSS in colocated `.css` files.
- `xlsx` (SheetJS) for parsing uploaded spreadsheets.

## Package manager & commands

Use **bun** (the lockfile is `bun.lock`; there is no `package-lock.json` /
`pnpm-lock.yaml`).

```bash
bun install
bun run dev       # Vite dev server with HMR
bun run build     # tsc -b && vite build
bun run lint      # eslint .
bun run preview   # preview the production build
```

- Before considering a change done, run `bun run lint` and `bun run build`; both
  must pass.
- There is **no test suite** in this repo. Do not invent test commands or claim
  tests were run.

## Repo-wide conventions

- The product domain and all user-facing UI text are in **Vietnamese**. Keep new
  UI strings, errors, and BBBG document text in Vietnamese.
- TypeScript is strict and `noUnusedLocals` / `noUnusedParameters` are on — dead
  code fails the build.
- `dist/` is generated output (git-ignored); never edit it by hand.

## Where things live

- `src/` — application source. See `src/CLAUDE.md` for code-authoring rules.
- `src/features/bbbg/` — the one feature, organized into domain/infrastructure/ui
  layers. See its `CLAUDE.md` for layer structure and domain rules.
- `docs/` — reference spec files. See `docs/CLAUDE.md` (read-only source of truth).
- `public/assets/` — static images referenced from print output (logos, signatures).
