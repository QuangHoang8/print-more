import type { BbbgDocumentData, SourceGroup } from "./types";

const DVBG_FIXED = "GINNO";

function padStt(stt: number): string {
  return String(stt).padStart(2, "0");
}

export function groupToBbbgDocument(group: SourceGroup): BbbgDocumentData {
  return {
    id: `bbbg-${group.stt}`,
    groupStt: group.stt,
    soVanBan: `${padStt(group.stt)}/PXK-BBBG-GINNO`,
    benB: {
      daiDien: group.contactName,
    },
    rows: group.items.map((item, index) => ({
      stt: index + 1,
      maDinhVi: item.alias,
      dvbg: DVBG_FIXED,
      soLuong: 1,
      dvNhanBg: group.pgd,
      ghiChu: "",
    })),
    quantity: group.quantity,
    pgd: group.pgd,
  };
}

export function groupsToBbbgDocuments(groups: SourceGroup[]): BbbgDocumentData[] {
  return groups.map(groupToBbbgDocument);
}
