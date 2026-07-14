import type { BbbgDocumentData } from "./types";
import "./BbbgDocument.css";

interface BbbgDocumentProps {
  data: BbbgDocumentData;
}

const HEADER_LOGO_SRC = "/assets/header-logo.png";
const SIGNATURE_BEN_A_SRC = "/assets/signature-ben-a.png";

function BbbgDocument({ data }: BbbgDocumentProps) {
  return (
    <div className="bbbg-page">
      <header className="bbbg-header">
        <img className="bbbg-header-logo" src={HEADER_LOGO_SRC} alt="G-innovations" />
      </header>
      <div className="bbbg-header-date">HN, ngày…...tháng…..năm 2026</div>

      <h1 className="bbbg-title">BIÊN BẢN BÀN GIAO THIẾT BỊ ĐỊNH VỊ</h1>
      <div className="bbbg-so">Số : {data.soVanBan}</div>

      <div className="bbbg-party">
        <p>BÊN A (BÊN GIAO) : Công ty cổ phần G-innovations Việt Nam</p>
        <p>Đại diện: Lý Thị Kiều Anh</p>
      </div>

      <div className="bbbg-party">
        <p>BÊN B (BÊN NHẬN) :</p>
        <p>Đại diện: {data.benB.daiDien}</p>
      </div>

      <table className="bbbg-table">
        <colgroup>
          <col className="bbbg-col-stt" />
          <col className="bbbg-col-ma" />
          <col className="bbbg-col-dvbg" />
          <col className="bbbg-col-dvnhan" />
          <col className="bbbg-col-ghichu" />
        </colgroup>
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã định vị</th>
            <th>ĐVBG</th>
            <th>ĐV Nhận BG</th>
            <th>Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row) => (
            <tr key={row.stt}>
              <td className="bbbg-cell-center">{row.stt}</td>
              <td>{row.maDinhVi}</td>
              <td className="bbbg-cell-center">{row.dvbg}</td>
              <td>{row.dvNhanBg}</td>
              <td>{row.ghiChu}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="bbbg-signatures">
        <div className="bbbg-signature-block">
          <p className="bbbg-signature-title">BÊN A</p>
          <img
            className="bbbg-signature-image"
            src={SIGNATURE_BEN_A_SRC}
            alt="Chữ ký Bên A"
          />
          <p className="bbbg-signature-name">Lý Thị Kiều Anh</p>
        </div>
        <div className="bbbg-signature-block">
          <p className="bbbg-signature-title">BÊN B</p>
          <div className="bbbg-signature-image" />
          <p className="bbbg-signature-name">{data.benB.daiDien}</p>
        </div>
      </div>
    </div>
  );
}

export default BbbgDocument;
