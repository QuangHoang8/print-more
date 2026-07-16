import { useMemo, useState } from "react";
import UploadPanel from "./features/bbbg/UploadPanel";
import PreviewList from "./features/bbbg/PreviewList";
import PrintArea from "./features/bbbg/PrintArea";
import { groupsToBbbgDocuments } from "./features/bbbg/mapping";
import type { BbbgDocumentData, ParsedExcelResult } from "./features/bbbg/types";
import "./features/bbbg/print.css";

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
      <section className="flex flex-col items-center gap-6 px-5 py-10 pb-[60px] no-print">
        <header className="text-center max-w-[640px]">
          <h1 className="text-3xl mb-2">In hàng loạt Biên bản bàn giao</h1>
          <p className="m-0">
            Tải lên file Excel danh sách bàn giao thiết bị định vị, xem trước và in hàng
            loạt các biên bản BBBG.
          </p>
        </header>

        <UploadPanel onParsed={handleParsed} />

        {docs.length > 0 && (
          <>
            <div className="w-full max-w-[900px] flex items-center justify-between gap-4 rounded-[10px] border border-[var(--border)] bg-[var(--code-bg)] p-3 px-4">
              <p className="m-0 text-[var(--text-h)]">
                Đã chọn <strong>{selectedDocs.length}</strong> / {docs.length} biên bản để
                in.
              </p>
              <button
                type="button"
                className="rounded-lg px-5 py-2.5 bg-[var(--accent)] text-white font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-105"
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
