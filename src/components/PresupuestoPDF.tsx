"use client";

import { Presupuesto } from "@/lib/types";
import { formatCurrency, formatDate, padNumero } from "@/lib/utils";

interface Props {
  presupuesto: Presupuesto;
}

export default function PresupuestoPDF({ presupuesto }: Props) {
  const p = presupuesto;

  return (
    <div
      id="presupuesto-pdf"
      className="bg-white text-black mx-auto"
      style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: "13px", lineHeight: "1.5", maxWidth: "800px", padding: "32px" }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: "20px", borderBottom: "3px solid #111", marginBottom: "16px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "0.5px", margin: 0 }}>FERNANDO D. GUIDI</h1>
          <p style={{ fontSize: "14px", color: "#444", fontWeight: 600, margin: "2px 0 0" }}>TALLER INTEGRAL</p>
          <p style={{ fontSize: "11px", color: "#888", margin: "6px 0 0", letterSpacing: "0.3px" }}>LAMADRID 2339, VILLA ADELINA</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ background: "#111", color: "#fff", padding: "10px 20px", display: "inline-block", borderRadius: "6px" }}>
            <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", margin: 0, opacity: 0.7 }}>PRESUPUESTO</p>
            <p style={{ fontSize: "18px", fontWeight: 800, margin: "2px 0 0" }}>N° {padNumero(p.numero)}</p>
          </div>
        </div>
      </div>

      {/* Sujeto a inflación */}
      <div style={{ textAlign: "center", margin: "12px 0 20px", padding: "6px 0", borderRadius: "4px", background: "#FEF2F2" }}>
        <span style={{ fontSize: "10px", fontWeight: 700, color: "#DC2626", letterSpacing: "2px", textTransform: "uppercase" }}>
          Presupuesto sujeto a inflación
        </span>
      </div>

      {/* Cliente + Fechas */}
      <div style={{ border: "1px solid #E5E7EB", borderRadius: "8px", marginBottom: "16px", overflow: "hidden" }}>
        <div style={{ background: "#F9FAFB", padding: "8px 16px", borderBottom: "1px solid #E5E7EB" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#6B7280" }}>Cliente</span>
        </div>
        <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: "15px", margin: 0 }}>{p.cliente.nombre}</p>
            {p.cliente.direccion && (
              <p style={{ fontSize: "12px", color: "#6B7280", margin: "4px 0 0" }}>{p.cliente.direccion}</p>
            )}
          </div>
          <div style={{ textAlign: "right", fontSize: "12px" }}>
            <p style={{ margin: "0 0 4px" }}>
              <span style={{ color: "#9CA3AF" }}>Fecha: </span>
              <span style={{ fontWeight: 600 }}>{formatDate(p.fecha)}</span>
            </p>
            <p style={{ margin: 0 }}>
              <span style={{ color: "#9CA3AF" }}>Vencimiento: </span>
              <span style={{ fontWeight: 600 }}>{formatDate(p.vencimiento)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Vehículo */}
      <div style={{ border: "1px solid #E5E7EB", borderRadius: "8px", marginBottom: "20px", overflow: "hidden" }}>
        <div style={{ background: "#F9FAFB", padding: "8px 16px", borderBottom: "1px solid #E5E7EB" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#6B7280" }}>Datos del vehículo</span>
        </div>
        <div style={{ padding: "12px 16px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "8px", fontSize: "12px" }}>
          <div>
            <span style={{ color: "#9CA3AF", fontSize: "10px", fontWeight: 600, letterSpacing: "0.5px" }}>MARCA</span>
            <p style={{ fontWeight: 700, margin: "2px 0 0" }}>{p.vehiculo.marca.toUpperCase()}</p>
          </div>
          <div>
            <span style={{ color: "#9CA3AF", fontSize: "10px", fontWeight: 600, letterSpacing: "0.5px" }}>TIPO</span>
            <p style={{ fontWeight: 700, margin: "2px 0 0" }}>{p.vehiculo.tipo.toUpperCase()}</p>
          </div>
          <div>
            <span style={{ color: "#9CA3AF", fontSize: "10px", fontWeight: 600, letterSpacing: "0.5px" }}>MODELO</span>
            <p style={{ fontWeight: 700, margin: "2px 0 0" }}>{p.vehiculo.modelo.toUpperCase()}</p>
          </div>
          <div>
            <span style={{ color: "#9CA3AF", fontSize: "10px", fontWeight: 600, letterSpacing: "0.5px" }}>PATENTE</span>
            <p style={{ fontWeight: 700, margin: "2px 0 0" }}>{p.vehiculo.patente.toUpperCase()}</p>
          </div>
        </div>
      </div>

      {/* Detalle */}
      <div style={{ border: "1px solid #E5E7EB", borderRadius: "8px", marginBottom: "24px", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
          <div style={{ padding: "10px 16px", fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#6B7280" }}>Detalle</div>
          <div style={{ padding: "10px 16px", fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#6B7280", textAlign: "right" }}>Valor</div>
        </div>
        {p.items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 140px",
              borderBottom: i < p.items.length - 1 ? "1px solid #F3F4F6" : "none",
            }}
          >
            <div style={{ padding: "14px 16px", fontSize: "13px", whiteSpace: "pre-line", lineHeight: "1.5" }}>{item.descripcion}</div>
            <div style={{ padding: "14px 16px", fontSize: "13px", fontWeight: 600, textAlign: "right" }}>
              {formatCurrency(item.valor)}
            </div>
          </div>
        ))}
        {/* Total */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", borderTop: "2px solid #111", background: "#F9FAFB" }}>
          <div style={{ padding: "14px 16px", fontSize: "14px", fontWeight: 800 }}>TOTAL</div>
          <div style={{ padding: "14px 16px", fontSize: "18px", fontWeight: 800, textAlign: "right" }}>
            {formatCurrency(p.total)}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: "40px", paddingTop: "16px", borderTop: "1px solid #E5E7EB", textAlign: "center" }}>
        <p style={{ fontWeight: 700, fontSize: "13px", color: "#374151", margin: "0 0 4px" }}>FERNANDO GUIDI</p>
        <p style={{ fontSize: "11px", color: "#9CA3AF", margin: 0 }}>fdguidi@hotmail.com &nbsp;|&nbsp; (+54 9) 11-6095-9020</p>
      </div>
    </div>
  );
}
