# docs — reference specs (read-only)

These files are the **source of truth** for the BBBG document format and the
source-spreadsheet layout, exported from real Excel files:

- `F88-D1-T7-2026_(1).md` / `.xlsx` — a real source spreadsheet. The column order
  here defines the `COL` index map in `src/features/bbbg/parseExcel.ts`.
- `BBBG_mẫu.md` / `.xlsx` — the target BBBG template that the rendered document
  (`src/features/bbbg/BbbgDocument.tsx`) must visually match.

Rules:

- Treat these as fixed reference data. **Do not edit them to make code pass** —
  when code and these specs disagree, change the code to match the spec (or ask).
- When source/target layout genuinely changes, update the doc first, then bring
  the parser/renderer in line with it.
