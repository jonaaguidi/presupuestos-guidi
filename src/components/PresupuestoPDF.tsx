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
      className="bg-white text-black max-w-[800px] mx-auto"
      style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: "13px", lineHeight: "1.4" }}
    >
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-4">
        <div>
          <h1 className="text-xl font-bold tracking-wide">FERNANDO D. GUIDI</h1>
          <p className="text-sm text-gray-700 font-medium">TALLER INTEGRAL</p>
          <p className="text-xs text-gray-500 mt-1">LAMADRID 2339, VILLA ADELINA</p>
        </div>
        <div className="text-right">
          <div className="bg-black text-white px-4 py-2 inline-block">
            <p className="text-xs font-bold">PRESUPUESTO</p>
            <p className="text-base font-bold">N° {padNumero(p.numero)}</p>
          </div>
        </div>
      </div>

      {/* Sujeto a inflación */}
      <div className="text-center mb-4">
        <span className="text-[11px] font-bold text-red-600 tracking-widest uppercase">
          Presupuesto sujeto a inflación
        </span>
      </div>

      {/* Cliente + Fechas */}
      <div className="border border-gray-300 rounded mb-4">
        <div className="bg-gray-100 px-3 py-1.5 border-b border-gray-300">
          <span className="text-xs font-bold uppercase tracking-wide">Cliente</span>
        </div>
        <div className="px-3 py-2 flex justify-between items-start">
          <div>
            <p className="font-bold text-sm">{p.cliente.nombre}</p>
            {p.cliente.direccion && (
              <p className="text-xs text-gray-600">{p.cliente.direccion}</p>
            )}
          </div>
          <div className="text-right text-xs">
            <p>
              <span className="text-gray-500">Fecha:</span>{" "}
              <span className="font-semibold">{formatDate(p.fecha)}</span>
            </p>
            <p>
              <span className="text-gray-500">Vencimiento:</span>{" "}
              <span className="font-semibold">{formatDate(p.vencimiento)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Vehículo */}
      <div className="border border-gray-300 rounded mb-4">
        <div className="bg-gray-100 px-3 py-1.5 border-b border-gray-300">
          <span className="text-xs font-bold uppercase tracking-wide">Datos del vehículo</span>
        </div>
        <div className="px-3 py-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div>
            <span className="text-gray-500">MARCA:</span>{" "}
            <span className="font-bold">{p.vehiculo.marca.toUpperCase()}</span>
          </div>
          <div>
            <span className="text-gray-500">TIPO:</span>{" "}
            <span className="font-bold">{p.vehiculo.tipo.toUpperCase()}</span>
          </div>
          <div>
            <span className="text-gray-500">MODELO:</span>{" "}
            <span className="font-bold">{p.vehiculo.modelo.toUpperCase()}</span>
          </div>
          <div>
            <span className="text-gray-500">PATENTE:</span>{" "}
            <span className="font-bold">{p.vehiculo.patente.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Detalle */}
      <div className="border border-gray-300 rounded mb-4">
        <div className="grid grid-cols-[1fr_auto] bg-gray-100 border-b border-gray-300">
          <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wide">Detalle</div>
          <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-right">Valor</div>
        </div>
        {p.items.map((item, i) => (
          <div
            key={i}
            className={`grid grid-cols-[1fr_auto] ${i < p.items.length - 1 ? "border-b border-gray-200" : ""}`}
          >
            <div className="px-3 py-2.5 text-sm whitespace-pre-line">{item.descripcion}</div>
            <div className="px-3 py-2.5 text-sm font-semibold text-right min-w-[120px]">
              {formatCurrency(item.valor)}
            </div>
          </div>
        ))}
        {/* Total */}
        <div className="grid grid-cols-[1fr_auto] border-t-2 border-black bg-gray-50">
          <div className="px-3 py-3 text-sm font-bold">TOTAL</div>
          <div className="px-3 py-3 text-base font-bold text-right min-w-[120px]">
            {formatCurrency(p.total)}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
        <p className="font-semibold text-gray-700">FERNANDO GUIDI</p>
        <p>fdguidi@hotmail.com | (+54 9) 11-6095-9020</p>
      </div>
    </div>
  );
}
