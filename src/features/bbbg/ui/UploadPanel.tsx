import { useCallback, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { BbbgParseError, parseBbbgExcel } from "../infrastructure/parseExcel";
import type { ParsedExcelResult } from "../domain/types";

interface UploadPanelProps {
  onParsed: (result: ParsedExcelResult) => void;
}

function UploadPanel({ onParsed }: UploadPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedFile, setLoadedFile] = useState<{ name: string; groupCount: number } | null>(
    null,
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await parseBbbgExcel(file);
        setLoadedFile({ name: result.fileName, groupCount: result.groups.length });
        onParsed(result);
      } catch (err) {
        setLoadedFile(null);
        setError(
          err instanceof BbbgParseError
            ? err.message
            : "Có lỗi xảy ra khi đọc file. Vui lòng thử lại.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [onParsed],
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) void handleFile(file);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  return (
    <div className="w-full max-w-[640px] mx-auto no-print">
      <div
        className={`relative rounded-xl border-2 border-dashed px-5 py-10 text-center cursor-pointer transition-colors duration-200 hover:border-[var(--accent)] hover:bg-[var(--accent-bg)] ${
          isDragging
            ? "border-[var(--accent)] bg-[var(--accent-bg)]"
            : "border-[var(--border)]"
        }`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") inputRef.current?.click();
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          onChange={handleInputChange}
        />
        <p className="m-0 text-[var(--text)]">
          Kéo-thả file Excel (.xlsx, .xls) vào đây, hoặc bấm để chọn file
        </p>
        {isLoading && <p className="mt-2 text-[var(--accent)]">Đang xử lý file...</p>}
      </div>

      {error && (
        <p className="mt-3 rounded-lg bg-red-100 px-3.5 py-2.5 text-left text-red-600">
          {error}
        </p>
      )}

      {loadedFile && !error && (
        <p className="mt-3 rounded-lg bg-[var(--accent-bg)] px-3.5 py-2.5 text-left text-[var(--text-h)]">
          Đã tải <strong>{loadedFile.name}</strong> — {loadedFile.groupCount} biên bản đã
          được phân tích.
        </p>
      )}
    </div>
  );
}

export default UploadPanel;
