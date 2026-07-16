# features/bbbg — BBBG handover documents

This is the only feature in the app: turn an uploaded Excel file into a set of
printable **Biên bản bàn giao thiết bị định vị** (GPS-device handover records),
one document per group.

## Layer Structure

The feature is organized into three layers:

- **`domain/`** — Pure business logic, no React or I/O side effects
  - `types.ts` — Domain models (SourceItem, SourceGroup, BbbgTableRow, etc.)
  - `constants.ts` — Legal and fixed business values (document title, company names, signature names, export location)
  - `mapping.ts` — Data transformation (converting SourceGroup → BbbgDocumentData)
  - `pagination.ts` — Print pagination logic (splitting rows across A4 pages)

- **`infrastructure/`** — External I/O and anti-corruption
  - `parseExcel.ts` — Excel file parsing; throws BbbgParseError on invalid input

- **`ui/`** — React presentation components
  - `BbbgDocument.tsx` + `BbbgDocument.css` — A4 document renderer
  - `PreviewList.tsx` — Document list with filtering and selection
  - `PrintArea.tsx` — Hidden print container
  - `UploadPanel.tsx` — File upload UI

- **Feature root** — Global styling
  - `print.css` — Global `@media print` rules for `.print-only` and `.no-print`

## Data pipeline (do not short-circuit these stages)

1. `infrastructure/parseExcel.ts` — reads the uploaded file with `xlsx` into raw
   rows, then `groupRows` builds `SourceGroup[]`.
2. `domain/mapping.ts` — `groupsToBbbgDocuments` converts each `SourceGroup` into
   a presentation-ready `BbbgDocumentData`.
3. `App.tsx` holds the docs + selection state.
4. `ui/BbbgDocument.tsx` renders one A4 document; `ui/PrintArea.tsx` renders the
   selected docs for printing; `ui/PreviewList.tsx` is the on-screen picker.

All shared shapes are defined in `domain/types.ts` — extend those interfaces
rather than redefining row/group shapes locally.

## Excel parsing rules

- The source spreadsheet groups many device rows (`Alias`) under one `STT`.
  Grouping is **forward-fill**: a non-empty `STT` starts a new group; following
  rows with an empty `STT` but a non-empty `Alias` belong to that group.
- Column indices are fixed in the `COL` map in `infrastructure/parseExcel.ts` and
  mirror the layout documented in `docs/F88-D1-T7-2026_(1).md`. If the source
  layout changes, update `COL` to match the doc — do not hardcode values elsewhere.
- Preferred sheet name is `T-7-1`; fall back to the first sheet if absent.
- Accept only `.xlsx` / `.xls` (`ACCEPTED_EXTENSIONS`).
- On any invalid input throw `BbbgParseError` with a **Vietnamese** message; the
  UI (`UploadPanel`) distinguishes `BbbgParseError` from unexpected errors.

## Business constants (source of truth: domain/constants.ts)

The following are legally-meaningful fixed values, change only on explicit request:

- Document title: `DOCUMENT_TITLE` in `domain/constants.ts`
- Bên A (giao/xuất kho): `BEN_A_COMPANY_NAME`, `BEN_A_REPRESENTATIVE` in `domain/constants.ts`
- Bên B (nhận): `BEN_B_COMPANY_NAME` in `domain/constants.ts`; "Đại diện PGD" and
  the "Đơn vị nhận (PGD)" column come from the parsed group (contact name / PGD).
- Export reason & location: `EXPORT_REASON`, `EXPORT_LOCATION` in `domain/constants.ts`
- Signatures: `THU_KHO_NAME`, `NHAN_VIEN_NAME` in `domain/constants.ts`; the Bên B
  signature name comes from the parsed group. Signature images live in
  `public/assets/` (`signature-thu-kho.png`, `signature-nhan-vien.png`).
- "Đơn vị giao" for every row is `GINNO` (`DVBG_FIXED` in `domain/mapping.ts`);
  "Số lượng" per row is always `1` and "Tổng cộng (Thiết bị)" is the row count.
- Document number format is `<STT padded to 2>/PXK-BBBG-GINNO`.
- Asset paths: `HEADER_LOGO_SRC`, `SIGNATURE_THU_KHO_SRC`, `SIGNATURE_NHAN_VIEN_SRC` in `domain/constants.ts`

## Print architecture

- Everything screen-only carries the `no-print` class; the printable output is
  inside `.print-only` (`ui/PrintArea`). These rules live in `print.css`.
- Printing is triggered by `window.print()` — there is no PDF library.
- Each `.bbbg-page` is one A4 page with a forced page break after it. Keep new
  document markup inside `.bbbg-page` so pagination stays correct.

## Assets

- Print images are referenced in `domain/constants.ts` as `HEADER_LOGO_SRC`, etc.,
  served from `public/assets/` by absolute path (e.g. `/assets/header-logo.png`).
  Add new print images there and reference them the same way.
