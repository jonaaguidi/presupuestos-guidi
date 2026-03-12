import jsPDF from "jspdf";
import { Presupuesto } from "./types";
import { formatCurrency, formatDate, padNumero } from "./utils";

export function generatePDF(p: Presupuesto) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentW = pageW - margin * 2;
  let y = margin;

  const colors = {
    black: "#111111",
    dark: "#374151",
    gray: "#6B7280",
    lightGray: "#9CA3AF",
    border: "#E5E7EB",
    bg: "#F9FAFB",
    red: "#DC2626",
    redBg: "#FEF2F2",
    white: "#FFFFFF",
  };

  // --- Header ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(colors.black);
  doc.text("FERNANDO D. GUIDI", margin, y + 6);

  doc.setFontSize(12);
  doc.setTextColor("#444444");
  doc.text("TALLER INTEGRAL", margin, y + 12);

  doc.setFontSize(9);
  doc.setTextColor(colors.lightGray);
  doc.text("LAMADRID 2339, VILLA ADELINA", margin, y + 17);

  // Budget number box
  const boxW = 50;
  const boxH = 18;
  const boxX = pageW - margin - boxW;
  doc.setFillColor(colors.black);
  roundedRect(doc, boxX, y - 2, boxW, boxH, 2, "F");

  doc.setFontSize(7);
  doc.setTextColor(colors.white);
  doc.setFont("helvetica", "bold");
  doc.text("PRESUPUESTO", boxX + boxW / 2, y + 4, { align: "center" });
  doc.setFontSize(14);
  doc.text(`N\u00B0 ${padNumero(p.numero)}`, boxX + boxW / 2, y + 12, { align: "center" });

  y += 22;

  // Header line
  doc.setDrawColor(colors.black);
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  // --- Sujeto a inflacion ---
  const inflW = contentW;
  doc.setFillColor(colors.redBg);
  roundedRect(doc, margin, y, inflW, 8, 2, "F");
  doc.setFontSize(7);
  doc.setTextColor(colors.red);
  doc.setFont("helvetica", "bold");
  doc.text("PRESUPUESTO SUJETO A INFLACION", pageW / 2, y + 5.5, { align: "center" });
  y += 14;

  // --- Cliente section ---
  y = drawSectionHeader(doc, "CLIENTE", margin, y, contentW, colors);

  const clienteY = y;
  doc.setFontSize(11);
  doc.setTextColor(colors.black);
  doc.setFont("helvetica", "bold");
  doc.text(p.cliente.nombre, margin + 4, clienteY + 5);

  if (p.cliente.direccion) {
    doc.setFontSize(9);
    doc.setTextColor(colors.gray);
    doc.setFont("helvetica", "normal");
    doc.text(p.cliente.direccion, margin + 4, clienteY + 10);
  }

  // Dates on right
  doc.setFontSize(9);
  const dateX = pageW - margin - 4;

  doc.setTextColor(colors.lightGray);
  doc.setFont("helvetica", "normal");
  doc.text("Fecha: ", dateX - 25, clienteY + 5);
  doc.setTextColor(colors.black);
  doc.setFont("helvetica", "bold");
  doc.text(formatDate(p.fecha), dateX, clienteY + 5, { align: "right" });

  doc.setTextColor(colors.lightGray);
  doc.setFont("helvetica", "normal");
  doc.text("Vencimiento: ", dateX - 25, clienteY + 10);
  doc.setTextColor(colors.black);
  doc.setFont("helvetica", "bold");
  doc.text(formatDate(p.vencimiento), dateX, clienteY + 10, { align: "right" });

  y = clienteY + 16;

  // Section border
  doc.setDrawColor(colors.border);
  doc.setLineWidth(0.3);
  doc.rect(margin, clienteY - 8, contentW, y - clienteY + 8);

  y += 6;

  // --- Vehiculo section ---
  y = drawSectionHeader(doc, "DATOS DEL VEHICULO", margin, y, contentW, colors);

  const vehY = y;
  const colW = contentW / 4;
  const fields = [
    { label: "MARCA", value: p.vehiculo.marca.toUpperCase() },
    { label: "TIPO", value: p.vehiculo.tipo.toUpperCase() },
    { label: "MODELO", value: p.vehiculo.modelo.toUpperCase() },
    { label: "PATENTE", value: p.vehiculo.patente.toUpperCase() },
  ];

  fields.forEach((f, i) => {
    const x = margin + 4 + i * colW;
    doc.setFontSize(7);
    doc.setTextColor(colors.lightGray);
    doc.setFont("helvetica", "bold");
    doc.text(f.label, x, vehY + 4);
    doc.setFontSize(10);
    doc.setTextColor(colors.black);
    doc.text(f.value, x, vehY + 9);
  });

  y = vehY + 14;

  doc.setDrawColor(colors.border);
  doc.setLineWidth(0.3);
  doc.rect(margin, vehY - 8, contentW, y - vehY + 8);

  y += 8;

  // --- Detalle section ---
  // Table header
  const detailHeaderY = y;
  doc.setFillColor(colors.bg);
  doc.rect(margin, detailHeaderY, contentW, 8, "F");
  doc.setDrawColor(colors.border);
  doc.setLineWidth(0.3);
  doc.rect(margin, detailHeaderY, contentW, 8);

  doc.setFontSize(8);
  doc.setTextColor(colors.gray);
  doc.setFont("helvetica", "bold");
  doc.text("DETALLE", margin + 4, detailHeaderY + 5.5);
  doc.text("VALOR", pageW - margin - 4, detailHeaderY + 5.5, { align: "right" });

  y = detailHeaderY + 8;

  // Items
  p.items.forEach((item, i) => {
    const lines = doc.splitTextToSize(item.descripcion, contentW - 50);
    const lineH = 5;
    const rowH = Math.max(lines.length * lineH + 6, 10);

    // Check page break
    if (y + rowH > doc.internal.pageSize.getHeight() - 30) {
      doc.addPage();
      y = margin;
    }

    doc.setDrawColor(colors.border);
    doc.setLineWidth(0.1);
    if (i < p.items.length - 1) {
      doc.line(margin, y + rowH, pageW - margin, y + rowH);
    }

    // Border sides
    doc.setDrawColor(colors.border);
    doc.setLineWidth(0.3);
    doc.line(margin, y, margin, y + rowH);
    doc.line(pageW - margin, y, pageW - margin, y + rowH);

    doc.setFontSize(10);
    doc.setTextColor(colors.black);
    doc.setFont("helvetica", "normal");
    doc.text(lines, margin + 4, y + 5);

    doc.setFont("helvetica", "bold");
    doc.text(formatCurrency(item.valor), pageW - margin - 4, y + 5, { align: "right" });

    y += rowH;
  });

  // Total row
  const totalH = 10;
  doc.setFillColor(colors.bg);
  doc.rect(margin, y, contentW, totalH, "F");
  doc.setDrawColor(colors.black);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  doc.setDrawColor(colors.border);
  doc.setLineWidth(0.3);
  doc.rect(margin, y, contentW, totalH);

  doc.setFontSize(11);
  doc.setTextColor(colors.black);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL", margin + 4, y + 7);
  doc.setFontSize(14);
  doc.text(formatCurrency(p.total), pageW - margin - 4, y + 7, { align: "right" });

  y += totalH + 20;

  // --- Footer ---
  if (y > doc.internal.pageSize.getHeight() - 25) {
    doc.addPage();
    y = doc.internal.pageSize.getHeight() - 25;
  }

  doc.setDrawColor(colors.border);
  doc.setLineWidth(0.3);
  doc.line(margin + 20, y, pageW - margin - 20, y);
  y += 6;

  doc.setFontSize(10);
  doc.setTextColor(colors.dark);
  doc.setFont("helvetica", "bold");
  doc.text("FERNANDO GUIDI", pageW / 2, y, { align: "center" });

  doc.setFontSize(8);
  doc.setTextColor(colors.lightGray);
  doc.setFont("helvetica", "normal");
  doc.text("fdguidi@hotmail.com  |  (+54 9) 11-6095-9020", pageW / 2, y + 5, { align: "center" });

  // Save
  const filename = `Presupuesto-${padNumero(p.numero)}-${p.cliente.nombre.replace(/\s+/g, "-")}.pdf`;
  doc.save(filename);
}

function drawSectionHeader(
  doc: jsPDF,
  title: string,
  x: number,
  y: number,
  w: number,
  colors: Record<string, string>
): number {
  doc.setFillColor(colors.bg);
  doc.rect(x, y, w, 7, "F");
  doc.setDrawColor(colors.border);
  doc.setLineWidth(0.3);
  doc.rect(x, y, w, 7);

  doc.setFontSize(8);
  doc.setTextColor(colors.gray);
  doc.setFont("helvetica", "bold");
  doc.text(title, x + 4, y + 5);

  return y + 7;
}

function roundedRect(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  style: string
) {
  doc.roundedRect(x, y, w, h, r, r, style);
}
