import type { BbbgDocumentData } from "../domain/types";
import BbbgDocument from "./BbbgDocument";

interface PrintAreaProps {
  docs: BbbgDocumentData[];
}

function PrintArea({ docs }: PrintAreaProps) {
  return (
    <div className="print-only">
      {docs.map((doc) => (
        <BbbgDocument key={doc.id} data={doc} />
      ))}
    </div>
  );
}

export default PrintArea;
