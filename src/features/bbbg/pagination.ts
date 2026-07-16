import type { BbbgTableRow } from "./types";

/**
 * Số dòng tối đa cho trang ĐẦU — đã trừ phần letterhead (logo, tiêu đề, thông
 * tin Bên A/Bên B, lý do/kho) nên ít hơn các trang sau.
 *
 * Các hằng số này là ước lượng theo chiều cao A4 (297mm, lề 10mm) và chiều cao
 * một dòng bảng (~7mm). Nếu bản in thực tế bị tràn hoặc thừa nhiều khoảng trắng,
 * chỉ cần chỉnh ba hằng số ở đây — đây là nơi duy nhất kiểm soát ngắt trang.
 */
export const ROWS_FIRST_PAGE = 24;

/** Số dòng tối đa cho các trang TIẾP THEO (đầu trang chỉ có tiêu đề cột). */
export const ROWS_CONT_PAGE = 34;

/**
 * Số dòng "dự phòng" phải nhường lại ở trang CUỐI cho phần tổng cộng (tfoot) và
 * bảng chữ ký. Nếu phần dòng còn lại nhiều hơn (sức chứa trang − dự phòng) thì
 * chữ ký sẽ bị đẩy sang một trang mới thay vì tràn mép giấy.
 */
export const ROWS_RESERVED_LAST = 8;

/** Một trang in của biên bản — một lát cắt các dòng cộng các cờ vị trí. */
export interface BbbgPage {
  rows: BbbgTableRow[];
  /** Trang đầu tiên — nơi hiển thị đầy đủ letterhead + thông tin hai bên. */
  isFirst: boolean;
  /** Trang cuối cùng — nơi hiển thị dòng tổng cộng và bảng chữ ký. */
  isLast: boolean;
  /** Số thứ tự trang (bắt đầu từ 1). */
  pageNumber: number;
  /** Tổng số trang của biên bản này. */
  pageCount: number;
}

/**
 * Chia danh sách dòng thiết bị thành các trang A4 sao cho trang cuối luôn còn
 * chỗ cho phần tổng cộng + chữ ký. Luôn trả về ít nhất một trang (kể cả khi
 * không có dòng nào) để phần khung biên bản vẫn được in.
 */
export function paginateRows(rows: BbbgTableRow[]): BbbgPage[] {
  const pages: Array<Pick<BbbgPage, "rows" | "isFirst">> = [];

  if (rows.length === 0) {
    pages.push({ rows: [], isFirst: true });
  } else {
    let index = 0;
    while (index < rows.length) {
      const isFirst = pages.length === 0;
      const capacity = isFirst ? ROWS_FIRST_PAGE : ROWS_CONT_PAGE;
      const remaining = rows.length - index;

      let take = Math.min(capacity, remaining);
      // Nếu lấy hết phần còn lại sẽ khiến trang này là trang cuối nhưng không
      // đủ chỗ cho tổng cộng + chữ ký, thì để lại một ít dòng cho một trang cuối
      // riêng mang phần chữ ký.
      const wouldFinish = index + take === rows.length;
      if (wouldFinish && take > capacity - ROWS_RESERVED_LAST) {
        take = Math.max(1, capacity - ROWS_RESERVED_LAST);
      }

      pages.push({ rows: rows.slice(index, index + take), isFirst });
      index += take;
    }
  }

  const pageCount = pages.length;
  return pages.map((page, i) => ({
    rows: page.rows,
    isFirst: page.isFirst,
    isLast: i === pageCount - 1,
    pageNumber: i + 1,
    pageCount,
  }));
}
