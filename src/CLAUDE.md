# src — code-authoring conventions

Rules for writing React/TypeScript code anywhere under `src/`. (Build tooling and
commands live in the root `CLAUDE.md`; BBBG domain logic lives in
`features/bbbg/CLAUDE.md`.)

## Components

- Write function components and `export default` them; name the file after the
  component (`UploadPanel.tsx` → `UploadPanel`).
- Type props with a local `interface` named `<Component>Props`.
- Apply component styles using Tailwind CSS v4 utility classes directly in JSX
  `className` attributes. Component styles are colocated in Tailwind, not in
  separate CSS files. Exception: if print-specific or layout-critical styles
  cannot be expressed in Tailwind (e.g., exact millimeter dimensions for the
  BBBG document), keep those in a minimal colocated `.css` file and import it.

## Types & imports

- Use `import type { ... }` for type-only imports — `verbatimModuleSyntax` is on
  and mixing will fail the build.
- Shared feature types belong in a `types.ts` module, not inline across files.

## State & data flow

- Application state is lifted into `App.tsx`; feature components receive data and
  callbacks via props and stay presentational. Keep new shared state in `App.tsx`
  rather than introducing a store.
- Pure data transforms and I/O (parsing, mapping) live in plain `.ts` modules,
  separate from components.

## React Compiler

- React Compiler is enabled, so **do not add manual `useMemo` / `useCallback` for
  new code** purely for performance — let the compiler handle it. (Some existing
  code still uses them; leave those as-is unless you're refactoring that file.)
