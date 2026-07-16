import type { BbbgDocumentData } from "./types";
import "./BbbgDocument.css";

interface BbbgDocumentProps {
  data: BbbgDocumentData;
}

const HEADER_LOGO_SRC = "/assets/header-logo.png";
const SIGNATURE_THU_KHO_SRC = "/assets/signature-thu-kho.png";
const SIGNATURE_NHAN_VIEN_SRC = "/assets/signature-nhan-vien.png";

function BbbgDocument({ data }: BbbgDocumentProps) {
  const tongThietBi = data.rows.reduce((sum, row) => sum + row.soLuong, 0);

  return (
    <div className="bbbg-page">
      <header className="bbbg-header">
        <img className="bbbg-header-logo" src={HEADER_LOGO_SRC} alt="G-innovations" />
      </header>
      <div className="bbbg-header-date">HN, ngày…...tháng…..năm 2026</div>

      <h1 className="bbbg-title">PHIẾU XUẤT KHO KIÊM BIÊN BẢN BÀN GIAO</h1>
      <div className="bbbg-so">Số: {data.soVanBan}</div>

      <div className="bbbg-party">
        <p className="bbbg-party-heading">
          BÊN A (BÊN GIAO/XUẤT KHO): Công ty Cổ phần G-innovations Việt Nam
        </p>
        <p>Đại diện: Lý Thị Kiều Anh</p>
      </div>

      <div className="bbbg-party">
        <p className="bbbg-party-heading">
          BÊN B (BÊN NHẬN): Công ty cổ phần kinh doanh F88
        </p>
        <p>Đại diện PGD: {data.benB.daiDien}</p>
      </div>

      <div className="bbbg-party">
        <p>Lý do xuất kho: Bàn giao thiết bị định vị theo hợp đồng/đơn hàng</p>
        <p>
          Xuất tại kho: GINNO_Tầng 12, Tòa G-Group Tower, Số 5 Nguyễn Thị Duệ, Phường Yên
          Hòa, Thành Phố Hà Nội, Việt Nam
        </p>
      </div>

      <table className="bbbg-table">
        <colgroup>
          <col className="bbbg-col-stt" />
          <col className="bbbg-col-ma" />
          <col className="bbbg-col-dvgiao" />
          <col className="bbbg-col-soluong" />
          <col className="bbbg-col-dvnhan" />
          <col className="bbbg-col-ghichu" />
        </colgroup>
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã định vị</th>
            <th>Đơn vị giao</th>
            <th>Số lượng</th>
            <th>Đơn vị nhận (PGD)</th>
            <th>Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row) => (
            <tr key={row.stt}>
              <td className="bbbg-cell-center">{row.stt}</td>
              <td>{row.maDinhVi}</td>
              <td className="bbbg-cell-center">{row.dvbg}</td>
              <td className="bbbg-cell-center">{row.soLuong}</td>
              <td>{row.dvNhanBg}</td>
              <td>{row.ghiChu}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="bbbg-cell-total" colSpan={3}>
              Tổng cộng (Thiết bị):
            </td>
            <td className="bbbg-cell-total-value">{tongThietBi}</td>
            <td />
            <td />
          </tr>
        </tfoot>
      </table>

      <table className="bbbg-sign-table">
        <colgroup>
          <col className="bbbg-sign-col-a" />
          <col className="bbbg-sign-col-a" />
          <col className="bbbg-sign-col-b" />
        </colgroup>
        <tbody>
          <tr>
            <th colSpan={2}>BÊN A</th>
            <th>BÊN B</th>
          </tr>
          <tr>
            <td className="bbbg-sign-cell">
              <p className="bbbg-signature-role">Thủ kho</p>
              <img
                className="bbbg-signature-image"
                src={SIGNATURE_THU_KHO_SRC}
                alt="Chữ ký Thủ kho"
              />
              <p className="bbbg-signature-name">Nguyễn Thị Thái Hậu</p>
            </td>
            <td className="bbbg-sign-cell">
              <p className="bbbg-signature-role">Nhân viên bàn giao</p>
              <img
                className="bbbg-signature-image"
                src={SIGNATURE_NHAN_VIEN_SRC}
                alt="Chữ ký Nhân viên bàn giao"
              />
              <p className="bbbg-signature-name">Lý Thị Kiều Anh</p>
            </td>
            <td className="bbbg-sign-cell">
              <p className="bbbg-signature-role">&nbsp;</p>
              <div className="bbbg-signature-image" />
              <p className="bbbg-signature-name">{data.benB.daiDien}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default BbbgDocument;
