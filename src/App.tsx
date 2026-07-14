import { useMemo, useState } from "react";
import UploadPanel from "./features/bbbg/UploadPanel";
import PreviewList from "./features/bbbg/PreviewList";
import PrintArea from "./features/bbbg/PrintArea";
import { groupsToBbbgDocuments } from "./features/bbbg/mapping";
import type { BbbgDocumentData, ParsedExcelResult } from "./features/bbbg/types";
import "./features/bbbg/print.css";
import "./App.css";

function App() {
  const [docs, setDocs] = useState<BbbgDocumentData[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleParsed = (result: ParsedExcelResult) => {
    const nextDocs = groupsToBbbgDocuments(result.groups);
    setDocs(nextDocs);
    setSelectedIds(new Set(nextDocs.map((doc) => doc.id)));
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectIds = (ids: string[]) => {
    setSelectedIds(new Set(ids));
  };

  const selectedDocs = useMemo(
    () => docs.filter((doc) => selectedIds.has(doc.id)),
    [docs, selectedIds],
  );

  return (
    <>
      <section className="bbbg-app no-print">
        <header className="bbbg-app-header">
          <h1>In hàng loạt Biên bản bàn giao</h1>
          <p>
            Tải lên file Excel danh sách bàn giao thiết bị định vị, xem trước và in hàng
            loạt các biên bản BBBG.
          </p>
        </header>

        <UploadPanel onParsed={handleParsed} />

        {docs.length > 0 && (
          <>
            <div className="bbbg-print-toolbar">
              <p>
                Đã chọn <strong>{selectedDocs.length}</strong> / {docs.length} biên bản để
                in.
              </p>
              <button
                type="button"
                className="bbbg-print-button"
                disabled={selectedDocs.length === 0}
                onClick={() => window.print()}
              >
                In hàng loạt
              </button>
            </div>

            <PreviewList
              docs={docs}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onSelectIds={handleSelectIds}
            />
          </>
        )}
      </section>

      <PrintArea docs={selectedDocs} />
    </>
  );
}

export default App;
