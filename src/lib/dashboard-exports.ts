import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatRupiah, getSelisih, type StapleItem } from "./staple-data";
import { formatSnapshotDate, formatSnapshotShort } from "./dashboard-utils";

function statusLabel(status: "naik" | "turun" | "stabil") {
  return status === "naik" ? "Naik" : status === "turun" ? "Turun" : "Stabil";
}

export function exportDashboardToExcel(items: StapleItem[], date: Date) {
  const rows = items.map((item) => {
    const { diff, pct, status } = getSelisih(item);
    return {
      "Nama Komoditas": item.nama,
      Kategori: item.kategori,
      Satuan: item.satuan,
      "Harga Kemarin (Rp)": item.hargaKemarin,
      "Harga Hari Ini (Rp)": item.hargaHariIni,
      "Selisih (Rp)": diff,
      "Perubahan (%)": Number(pct.toFixed(2)),
      Status: statusLabel(status),
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet["!cols"] = [
    { wch: 28 }, { wch: 22 }, { wch: 10 }, { wch: 18 },
    { wch: 18 }, { wch: 14 }, { wch: 14 }, { wch: 12 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Harga Bahan Pokok");

  const filename = `SIPANGAN_Harga_${formatSnapshotShort(date).replace(/\s/g, "_")}.xlsx`;
  XLSX.writeFile(workbook, filename);
}

export function exportDashboardToPdf(items: StapleItem[], date: Date) {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header band
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 70, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("SIPANGAN — Sistem Informasi Pangan Nasional", 40, 32);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Direktorat Stabilitas Harga Pokok · Republik Indonesia", 40, 50);

  doc.setTextColor(40, 40, 40);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Laporan Harian Harga Bahan Pokok", 40, 100);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Snapshot Tanggal: ${formatSnapshotDate(date)}`, 40, 116);
  doc.text(`Total Komoditas: ${items.length}`, 40, 130);

  const body = items.map((item) => {
    const { diff, pct, status } = getSelisih(item);
    return [
      item.nama,
      item.kategori,
      item.satuan,
      formatRupiah(item.hargaKemarin),
      formatRupiah(item.hargaHariIni),
      `${diff >= 0 ? "+" : ""}${diff.toLocaleString("id-ID")}`,
      `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`,
      statusLabel(status),
    ];
  });

  autoTable(doc, {
    startY: 145,
    head: [[
      "Nama Komoditas", "Kategori", "Satuan",
      "Harga Kemarin", "Harga Hari Ini", "Selisih (Rp)", "Perubahan", "Status",
    ]],
    body,
    styles: { font: "helvetica", fontSize: 9, cellPadding: 6 },
    headStyles: { fillColor: [30, 41, 59], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      3: { halign: "right" },
      4: { halign: "right" },
      5: { halign: "right" },
      6: { halign: "right" },
      7: { halign: "center" },
    },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 7) {
        const v = data.cell.raw as string;
        if (v === "Naik") data.cell.styles.textColor = [185, 28, 28];
        else if (v === "Turun") data.cell.styles.textColor = [21, 128, 61];
      }
    },
  });

  const finalY = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 145;
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(
    "Sumber: PIHPS Nasional · Bank Indonesia · Data merupakan rata-rata nasional dari 514 kota/kabupaten.",
    40,
    finalY + 24,
  );

  const filename = `SIPANGAN_Laporan_${formatSnapshotShort(date).replace(/\s/g, "_")}.pdf`;
  doc.save(filename);
}
