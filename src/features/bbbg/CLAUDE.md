# features/bbbg — BBBG handover documents

This is the only feature in the app: turn an uploaded Excel file into a set of
printable **Biên bản bàn giao thiết bị định vị** (GPS-device handover records),
one document per group.

## Data pipeline (do not short-circuit these stages)

1. `parseExcel.ts` — reads the uploaded file with `xlsx` into raw rows, then
   `groupRows` builds `SourceGroup[]`.
2. `mapping.ts` — `groupsToBbbgDocuments` converts each `SourceGroup` into a
   presentation-ready `BbbgDocumentData`.
3. `App.tsx` holds the docs + selection state.
4. `BbbgDocument.tsx` renders one A4 document; `PrintArea.tsx` renders the
   selected docs for printing; `PreviewList.tsx` is the on-screen picker.

All shared shapes are defined in `types.ts` — extend those interfaces rather than
redefining row/group shapes locally.

## Excel parsing rules

- The source spreadsheet groups many device rows (`Alias`) under one `STT`.
  Grouping is **forward-fill**: a non-empty `STT` starts a new group; following
  rows with an empty `STT` but a non-empty `Alias` belong to that group.
- Column indices are fixed in the `COL` map in `parseExcel.ts` and mirror the
  layout documented in `docs/F88-D1-T7-2026_(1).md`. If the source layout changes,
  update `COL` to match the doc — do not hardcode values elsewhere.
- Preferred sheet name is `T-7-1`; fall back to the first sheet if absent.
- Accept only `.xlsx` / `.xls` (`ACCEPTED_EXTENSIONS`).
- On any invalid input throw `BbbgParseError` with a **Vietnamese** message; the
  UI (`UploadPanel`) distinguishes `BbbgParseError` from unexpected errors.

## Business constants (change only on explicit request)

These are legally-meaningful fixed values, not placeholders:

- Bên A (giao) is always **Công ty cổ phần G-innovations Việt Nam**, đại diện
  **Lý Thị Kiều Anh**, hardcoded in `BbbgDocument.tsx`.
- ĐVBG for every row is `GINNO` (`DVBG_FIXED` in `mapping.ts`).
- Document number format is `<STT padded to 2>/BBBG-GINNO`.
- Bên B đại diện and ĐV Nhận BG come from the parsed group.

## Print architecture

- Everything screen-only carries the `no-print` class; the printable output is
  inside `.print-only` (`PrintArea`). These rules live in `print.css`.
- Printing is triggered by `window.print()` — there is no PDF library.
- Each `.bbbg-page` is one A4 page with a forced page break after it. Keep new
  document markup inside `.bbbg-page` so pagination stays correct.

## Assets

- Print images are served from `public/assets/` and referenced by absolute path
  (e.g. `/assets/header-logo.png`, `/assets/signature-ben-a.png`). Add new print
  images there and reference them the same way.
