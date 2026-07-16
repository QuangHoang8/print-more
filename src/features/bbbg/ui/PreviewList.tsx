import { useMemo, useState } from "react";
import type { BbbgDocumentData } from "./types";
import BbbgDocument from "./BbbgDocument";

interface PreviewListProps {
  docs: BbbgDocumentData[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onSelectIds: (ids: string[]) => void;
}

function PreviewList({ docs, selectedIds, onToggleSelect, onSelectIds }: PreviewListProps) {
  const [filterText, setFilterText] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredDocs = useMemo(() => {
    const term = filterText.trim().toLowerCase();
    if (!term) return docs;
    return docs.filter(
      (doc) =>
        doc.benB.daiDien.toLowerCase().includes(term) ||
        doc.pgd.toLowerCase().includes(term) ||
        doc.soVanBan.toLowerCase().includes(term),
    );
  }, [docs, filterText]);

  const filteredIds = useMemo(() => filteredDocs.map((doc) => doc.id), [filteredDocs]);
  const allFilteredSelected =
    filteredIds.length > 0 && filteredIds.every((id) => selectedIds.has(id));

  return (
    <div className="w-full max-w-[900px] mx-auto text-left no-print">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <input
          type="search"
          className="flex-1 min-w-[280px] rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text-h)] font-inherit"
          placeholder="Lọc theo đại diện, PGD hoặc số biên bản..."
          value={filterText}
          onChange={(event) => setFilterText(event.target.value)}
        />
        <label className="flex items-center gap-2 whitespace-nowrap text-[var(--text-h)]">
          <input
            type="checkbox"
            checked={allFilteredSelected}
            onChange={() => onSelectIds(allFilteredSelected ? [] : filteredIds)}
          />
          Chọn tất cả ({filteredDocs.length})
        </label>
      </div>

      <ul className="m-0 p-0 list-none flex flex-col gap-2.5">
        {filteredDocs.map((doc) => {
          const isExpanded = expandedId === doc.id;
          return (
            <li className="border border-[var(--border)] rounded-[10px] p-3 px-4" key={doc.id}>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedIds.has(doc.id)}
                  onChange={() => onToggleSelect(doc.id)}
                />
                <div className="flex-1">
                  <p className="m-0 font-semibold text-[var(--text-h)]">Biên bản {doc.soVanBan}</p>
                  <p className="mt-0.5 text-sm text-[var(--text)]">
                    PGD: {doc.pgd || "—"} · Đại diện: {doc.benB.daiDien || "—"} ·{" "}
                    {doc.rows.length} mã định vị
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-md border border-[var(--accent-border)] bg-[var(--accent-bg)] px-3.5 py-1.5 text-[var(--text-h)] cursor-pointer whitespace-nowrap hover:bg-[var(--accent-border)]"
                  onClick={() => setExpandedId(isExpanded ? null : doc.id)}
                >
                  {isExpanded ? "Ẩn xem trước" : "Xem trước"}
                </button>
              </div>

              {isExpanded && (
                <div className="mt-3.5 border-t border-[var(--border)] pt-3.5 overflow-auto">
                  <div
                    style={{
                      width: "210mm",
                      transform: "scale(0.55)",
                      transformOrigin: "top left",
                      marginBottom: "calc(-297mm * 0.45)",
                      boxShadow: "var(--shadow)",
                    }}
                  >
                    <BbbgDocument data={doc} />
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {filteredDocs.length === 0 && (
        <p className="mt-5 text-[var(--text)]">Không có biên bản nào khớp với bộ lọc.</p>
      )}
    </div>
  );
}

export default PreviewList;
