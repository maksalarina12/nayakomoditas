import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatRupiah, getSelisih, type StapleItem } from "./staple-data";
import { formatSnapshotDate, formatSnapshotShort } from "./dashboard-utils";
import { type CityProfile } from "./city-data";

function fileSafe(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function statusLabel(status: "naik" | "turun" | "stabil") {
  return status === "naik" ? "Naik" : status === "turun" ? "Turun" : "Stabil";
}

/** Auto-fit column width based on the longest cell content. */
function autoFitColumns(rows: Record<string, string | number>[], headers: string[]) {
  return headers.map((h) => {
    const maxContent = rows.reduce((max, row) => {
      const v = row[h];
      const len = v == null ? 0 : String(v).length;
      return Math.max(max, len);
    }, h.length);
    return { wch: Math.min(Math.max(maxContent + 2, 10), 40) };
  });
}

export function exportDashboardToExcel(items: StapleItem[], date: Date, city: CityProfile) {
  const dateLabel = formatSnapshotDate(date);
  const dateShort = formatSnapshotShort(date);
  const cityLabel = city.shortLabel;
  const filenameDate = fileSafe(dateShort);

  const rows = items.map((item) => {
    const { diff, pct, status } = getSelisih(item);
    return {
      "Tanggal Snapshot": dateShort,
      "Nama Komoditas": item.nama,
      Kategori: item.kategori,
      Satuan: item.satuan,
      "Harga Kemarin": item.hargaKemarin,
      "Harga Hari Ini": item.hargaHariIni,
      "Selisih (Rp)": diff,
      "Perubahan (%)": Number(pct.toFixed(2)),
      Status: statusLabel(status),
    };
  });

  const headers = [
    "Tanggal Snapshot",
    "Nama Komoditas",
    "Kategori",
    "Satuan",
    "Harga Kemarin",
    "Harga Hari Ini",
    "Selisih (Rp)",
    "Perubahan (%)",
    "Status",
  ];

  // Build sheet starting with a small report header band on rows 1-3
  const worksheet = XLSX.utils.aoa_to_sheet([
    ["RAKAN UMKM - Laporan Monitoring Harga"],
    [`Lokasi: ${cityLabel}`],
    [`Tanggal: ${dateLabel}`],
    [`Sumber: ${city.source}`],
    [`Total Komoditas: ${items.length}`],
    [],
  ]);

  XLSX.utils.sheet_add_json(worksheet, rows, { origin: "A7", header: headers });

  // Column widths (auto-fit)
  worksheet["!cols"] = autoFitColumns(rows, headers);

  // Merge title row across all columns
  worksheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: headers.length - 1 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: headers.length - 1 } },
    { s: { r: 3, c: 0 }, e: { r: 3, c: headers.length - 1 } },
    { s: { r: 4, c: 0 }, e: { r: 4, c: headers.length - 1 } },
  ];

  // Apply Rupiah number format to currency columns (E, F, G = idx 4,5,6) for data rows
  const currencyFmt = '"Rp"#,##0;[Red]"Rp"-#,##0;"-"';
  const pctFmt = '0.00"%"';
  const dataStartRow = 8; // rows 1-7 are report metadata + table header
  const dataEndRow = dataStartRow + rows.length - 1;

  for (let r = dataStartRow; r <= dataEndRow; r++) {
    ["E", "F", "G"].forEach((col) => {
      const ref = `${col}${r}`;
      if (worksheet[ref]) worksheet[ref].z = currencyFmt;
    });
    const pctRef = `H${r}`;
    if (worksheet[pctRef]) worksheet[pctRef].z = pctFmt;
  }

  const workbook = XLSX.utils.book_new();
  workbook.Props = {
    Title: "RAKAN UMKM - Laporan Monitoring Harga",
    Subject: `${cityLabel} · Snapshot ${dateLabel}`,
    Author: "RAKAN UMKM",
    CreatedDate: new Date(),
  };
  XLSX.utils.book_append_sheet(workbook, worksheet, "Harga Bahan Pokok");

  const filename = `Data_Harga_${fileSafe(cityLabel)}_${filenameDate}.xlsx`;
  XLSX.writeFile(workbook, filename);
}

export function exportDashboardToPdf(items: StapleItem[], date: Date, city: CityProfile) {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const dateLabel = formatSnapshotDate(date);
  const dateShort = formatSnapshotShort(date);
  const cityLabel = city.shortLabel;
  const filenameDate = fileSafe(dateShort);

  // Header band
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 70, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("RAKAN UMKM - Laporan Monitoring Harga", 40, 32);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`${cityLabel} · ${city.source}`, 40, 50);

  // Date pill on the right
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(pageWidth - 240, 22, 200, 28, 4, 4, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(`SNAPSHOT ${dateShort.toUpperCase()}`, pageWidth - 230, 40);

  doc.setTextColor(40, 40, 40);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("RAKAN UMKM - Laporan Monitoring Harga", 40, 100);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Lokasi: ${cityLabel}`, 40, 116);
  doc.text(`Tanggal: ${dateLabel}`, 40, 130);
  doc.text(`Sumber: ${city.source}`, 40, 144);
  doc.text(`Total Komoditas: ${items.length}`, 40, 158);

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
    startY: 174,
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
    `Sumber: ${city.source} · Data mock stabil untuk monitoring UMKM.`,
    40,
    finalY + 24,
  );

  const filename = `Laporan_Harga_${fileSafe(cityLabel)}_${filenameDate}.pdf`;
  doc.save(filename);
}
