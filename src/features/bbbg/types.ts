/** Một dòng "Mã định vị" (Alias) thuộc một nhóm STT trong sheet nguồn. */
export interface SourceItem {
  alias: string;
}

/** Một nhóm dữ liệu ứng với một biên bản (được gom theo cột STT forward-fill). */
export interface SourceGroup {
  stt: number;
  pgd: string;
  contactName: string;
  phone: string;
  address: string;
  quantity: number | null;
  items: SourceItem[];
}

/** Kết quả parse file Excel nguồn. */
export interface ParsedExcelResult {
  fileName: string;
  sheetName: string;
  groups: SourceGroup[];
}

/** Một dòng trong bảng chi tiết của biên bản BBBG. */
export interface BbbgTableRow {
  stt: number;
  maDinhVi: string;
  dvbg: string;
  dvNhanBg: string;
  ghiChu: string;
}

/** Dữ liệu đã điền đầy đủ cho một biên bản BBBG (1 nhóm STT = 1 biên bản). */
export interface BbbgDocumentData {
  id: string;
  groupStt: number;
  soVanBan: string;
  benB: {
    daiDien: string;
  };
  rows: BbbgTableRow[];
  quantity: number | null;
  pgd: string;
}
