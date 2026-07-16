import * as XLSX from "xlsx";
import type { ParsedExcelResult, SourceGroup } from "./types";

export const ACCEPTED_EXTENSIONS = [".xlsx", ".xls"];
const SOURCE_SHEET_NAME = "T-7-1";

// Chỉ số cột trong sheet nguồn (0-based), theo cấu trúc mô tả trong
// docs/F88-D1-T7-2026_(1).md: STT | Alias | CCID | PGD | Người liên hệ | SĐT | Địa chỉ | ... | Số lượng
const COL = {
  stt: 0,
  alias: 1,
  pgd: 3,
  contactName: 4,
  phone: 5,
  address: 6,
  quantity: 11,
} as const;

export class BbbgParseError extends Error {}

function isBlank(value: unknown): boolean {
  return value === null || value === undefined || String(value).trim() === "";
}

function toText(value: unknown): string {
  return isBlank(value) ? "" : String(value).trim();
}

function toGroupNumber(value: unknown): number | null {
  if (isBlank(value)) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed) : null;
}

function toQuantity(value: unknown): number | null {
  if (isBlank(value)) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function findHeaderRowIndex(rows: unknown[][]): number {
  return rows.findIndex((row) => toText(row[COL.stt]).toUpperCase() === "STT");
}

function groupRows(rows: unknown[][]): SourceGroup[] {
  const groups: SourceGroup[] = [];
  let current: SourceGroup | null = null;

  for (const row of rows) {
    const alias = toText(row[COL.alias]);
    const sttValue = toGroupNumber(row[COL.stt]);

    if (sttValue !== null) {
      current = {
        stt: sttValue,
        pgd: toText(row[COL.pgd]),
        contactName: toText(row[COL.contactName]),
        phone: toText(row[COL.phone]),
        address: toText(row[COL.address]),
        quantity: toQuantity(row[COL.quantity]),
        items: [],
      };
      groups.push(current);
    }

    if (alias === "") continue;
    if (!current) continue;

    current.items.push({ alias });
  }

  return groups.filter((group) => group.items.length > 0);
}

export async function parseBbbgExcel(file: File): Promise<ParsedExcelResult> {
  const lowerName = file.name.toLowerCase();
  if (!ACCEPTED_EXTENSIONS.some((ext) => lowerName.endsWith(ext))) {
    throw new BbbgParseError(
      `File "${file.name}" không đúng định dạng. Vui lòng chọn file .xlsx hoặc .xls.`,
    );
  }

  const buffer = await file.arrayBuffer();

  let workbook: XLSX.WorkBook;
  try {
    workbook = XLSX.read(buffer, { type: "array" });
  } catch {
    throw new BbbgParseError(
      `Không thể đọc file "${file.name}". File có thể bị hỏng hoặc không phải file Excel hợp lệ.`,
    );
  }

  const sheetName = workbook.SheetNames.includes(SOURCE_SHEET_NAME)
    ? SOURCE_SHEET_NAME
    : workbook.SheetNames[0];

  if (!sheetName) {
    throw new BbbgParseError(`File "${file.name}" không có sheet nào.`);
  }

  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
    header: 1,
    defval: null,
    raw: true,
  });

  const headerIndex = findHeaderRowIndex(rows);
  const dataRows = headerIndex >= 0 ? rows.slice(headerIndex + 1) : rows;
  const groups = groupRows(dataRows);

  if (groups.length === 0) {
    throw new BbbgParseError(
      `Không tìm thấy dữ liệu hợp lệ trong sheet "${sheetName}" của file "${file.name}".`,
    );
  }

  return { fileName: file.name, sheetName, groups };
}
