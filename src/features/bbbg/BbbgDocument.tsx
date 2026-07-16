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
      <header className="block">
        <img className="block w-full h-auto object-contain" src={HEADER_LOGO_SRC} alt="G-innovations" />
      </header>
      <div className="text-right italic mt-1.5">HN, ngày…...tháng…..năm 2026</div>

      <h1 className="text-center text-lg font-bold my-4.5 mx-0">PHIẾU XUẤT KHO KIÊM BIÊN BẢN BÀN GIAO</h1>
      <div className="text-center font-bold mb-3.5">Số: {data.soVanBan}</div>

      <div className="mb-2 text-left">
        <p className="font-bold m-0.5">
          BÊN A (BÊN GIAO/XUẤT KHO): Công ty Cổ phần G-innovations Việt Nam
        </p>
        <p className="my-0.5 mx-0">Đại diện: Lý Thị Kiều Anh</p>
      </div>

      <div className="mb-2 text-left">
        <p className="font-bold m-0.5">
          BÊN B (BÊN NHẬN): Công ty cổ phần kinh doanh F88
        </p>
        <p className="my-0.5 mx-0">Đại diện PGD: {data.benB.daiDien}</p>
      </div>

      <div className="mb-2 text-left">
        <p className="my-0.5 mx-0">Lý do xuất kho: Bàn giao thiết bị định vị theo hợp đồng/đơn hàng</p>
        <p className="my-0.5 mx-0">
          Xuất tại kho: GINNO_Tầng 12, Tòa G-Group Tower, Số 5 Nguyễn Thị Duệ, Phường Yên
          Hòa, Thành Phố Hà Nội, Việt Nam
        </p>
      </div>

      <table className="w-full border-collapse mt-3.5 table-fixed">
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
            <th className="border border-black p-1 text-center font-bold">STT</th>
            <th className="border border-black p-1 text-center font-bold">Mã định vị</th>
            <th className="border border-black p-1 text-center font-bold">Đơn vị giao</th>
            <th className="border border-black p-1 text-center font-bold">Số lượng</th>
            <th className="border border-black p-1 text-center font-bold">Đơn vị nhận (PGD)</th>
            <th className="border border-black p-1 text-center font-bold">Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row) => (
            <tr key={row.stt}>
              <td className="border border-black p-1 text-center align-top break-words">{row.stt}</td>
              <td className="border border-black p-1 text-left align-top break-words">{row.maDinhVi}</td>
              <td className="border border-black p-1 text-center align-top break-words">{row.dvbg}</td>
              <td className="border border-black p-1 text-center align-top break-words">{row.soLuong}</td>
              <td className="border border-black p-1 text-left align-top break-words">{row.dvNhanBg}</td>
              <td className="border border-black p-1 text-left align-top break-words">{row.ghiChu}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="border border-black p-1 text-center font-bold" colSpan={3}>
              Tổng cộng (Thiết bị):
            </td>
            <td className="border border-black p-1 text-center font-bold">{tongThietBi}</td>
            <td className="border border-black p-1" />
            <td className="border border-black p-1" />
          </tr>
        </tfoot>
      </table>

      <table className="w-full border-collapse mt-6 table-fixed text-center">
        <colgroup>
          <col className="bbbg-sign-col-a" />
          <col className="bbbg-sign-col-a" />
          <col className="bbbg-sign-col-b" />
        </colgroup>
        <tbody>
          <tr>
            <th className="border border-black p-1.5 font-bold" colSpan={2}>BÊN A</th>
            <th className="border border-black p-1.5 font-bold">BÊN B</th>
          </tr>
          <tr>
            <td className="border border-black p-1.5 text-center align-top">
              <p className="font-bold m-1 mx-0">Thủ kho</p>
              <img
                className="bbbg-signature-image"
                src={SIGNATURE_THU_KHO_SRC}
                alt="Chữ ký Thủ kho"
              />
              <p className="font-bold mt-1.5 mx-0">Nguyễn Thị Thái Hậu</p>
            </td>
            <td className="border border-black p-1.5 text-center align-top">
              <p className="font-bold m-1 mx-0">Nhân viên bàn giao</p>
              <img
                className="bbbg-signature-image"
                src={SIGNATURE_NHAN_VIEN_SRC}
                alt="Chữ ký Nhân viên bàn giao"
              />
              <p className="font-bold mt-1.5 mx-0">Lý Thị Kiều Anh</p>
            </td>
            <td className="border border-black p-1.5 text-center align-top">
              <p className="font-bold m-1 mx-0">&nbsp;</p>
              <div className="bbbg-signature-image" />
              <p className="font-bold mt-1.5 mx-0">{data.benB.daiDien}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default BbbgDocument;
