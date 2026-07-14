import { useCallback, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { BbbgParseError, parseBbbgExcel } from "./parseExcel";
import type { ParsedExcelResult } from "./types";
import "./UploadPanel.css";

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
    <div className="upload-panel no-print">
      <div
        className={`upload-dropzone${isDragging ? " is-dragging" : ""}`}
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
          className="upload-input"
          onChange={handleInputChange}
        />
        <p className="upload-instructions">
          Kéo-thả file Excel (.xlsx, .xls) vào đây, hoặc bấm để chọn file
        </p>
        {isLoading && <p className="upload-status">Đang xử lý file...</p>}
      </div>

      {error && <p className="upload-error">{error}</p>}

      {loadedFile && !error && (
        <p className="upload-success">
          Đã tải <strong>{loadedFile.name}</strong> — {loadedFile.groupCount} biên bản đã
          được phân tích.
        </p>
      )}
    </div>
  );
}

export default UploadPanel;
