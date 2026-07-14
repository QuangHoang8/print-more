import { useMemo, useState } from "react";
import type { BbbgDocumentData } from "./types";
import BbbgDocument from "./BbbgDocument";
import "./PreviewList.css";

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
    <div className="preview-list no-print">
      <div className="preview-toolbar">
        <input
          type="search"
          className="preview-filter"
          placeholder="Lọc theo đại diện, PGD hoặc số biên bản..."
          value={filterText}
          onChange={(event) => setFilterText(event.target.value)}
        />
        <label className="preview-select-all">
          <input
            type="checkbox"
            checked={allFilteredSelected}
            onChange={() => onSelectIds(allFilteredSelected ? [] : filteredIds)}
          />
          Chọn tất cả ({filteredDocs.length})
        </label>
      </div>

      <ul className="preview-cards">
        {filteredDocs.map((doc) => {
          const isExpanded = expandedId === doc.id;
          return (
            <li className="preview-card" key={doc.id}>
              <div className="preview-card-row">
                <input
                  type="checkbox"
                  checked={selectedIds.has(doc.id)}
                  onChange={() => onToggleSelect(doc.id)}
                />
                <div className="preview-card-info">
                  <p className="preview-card-title">Biên bản {doc.soVanBan}</p>
                  <p className="preview-card-meta">
                    PGD: {doc.pgd || "—"} · Đại diện: {doc.benB.daiDien || "—"} ·{" "}
                    {doc.rows.length} mã định vị
                  </p>
                </div>
                <button
                  type="button"
                  className="preview-toggle-button"
                  onClick={() => setExpandedId(isExpanded ? null : doc.id)}
                >
                  {isExpanded ? "Ẩn xem trước" : "Xem trước"}
                </button>
              </div>

              {isExpanded && (
                <div className="preview-a4-wrapper">
                  <div className="preview-a4-scale">
                    <BbbgDocument data={doc} />
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {filteredDocs.length === 0 && (
        <p className="preview-empty">Không có biên bản nào khớp với bộ lọc.</p>
      )}
    </div>
  );
}

export default PreviewList;
