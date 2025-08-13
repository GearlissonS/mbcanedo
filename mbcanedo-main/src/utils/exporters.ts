import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportCSV(filename: string, rows: any[], headers?: string[]) {
  if (!rows.length) return;
  const keys = headers || Object.keys(rows[0]);
  const escape = (v: any) => {
    const s = String(v ?? "");
    if (s.includes(",") || s.includes("\n") || s.includes('"')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };
  const csv = [keys.join(","), ...rows.map((r) => keys.map((k) => escape(r[k])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 500);
}

export function exportXLSX(filename: string, rows: any[]) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, "Dados");
  XLSX.writeFile(wb, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
}

export function exportPDF(filename: string, rows: any[], columns: { header: string; key: string }[]) {
  const doc = new jsPDF({ orientation: "landscape" });
  autoTable(doc, {
    head: [columns.map((c) => c.header)],
    body: rows.map((r) => columns.map((c) => r[c.key])),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [29, 78, 216] },
  });
  doc.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
}
