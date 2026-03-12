"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Presupuesto, PresupuestoItem } from "@/lib/types";
import { savePresupuesto, getNextNumero } from "@/lib/storage";
import { addDays } from "@/lib/utils";
import Link from "next/link";

interface Props {
  existing?: Presupuesto;
}

export default function PresupuestoForm({ existing }: Props) {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [fecha, setFecha] = useState(existing?.fecha ?? today);
  const [vencimiento, setVencimiento] = useState(existing?.vencimiento ?? addDays(today, 30));
  const [clienteNombre, setClienteNombre] = useState(existing?.cliente.nombre ?? "");
  const [clienteDireccion, setClienteDireccion] = useState(existing?.cliente.direccion ?? "");
  const [marca, setMarca] = useState(existing?.vehiculo.marca ?? "");
  const [tipo, setTipo] = useState(existing?.vehiculo.tipo ?? "");
  const [modelo, setModelo] = useState(existing?.vehiculo.modelo ?? "");
  const [patente, setPatente] = useState(existing?.vehiculo.patente ?? "");
  const [items, setItems] = useState<PresupuestoItem[]>(
    existing?.items ?? [{ descripcion: "", valor: 0 }]
  );

  useEffect(() => {
    if (!existing) {
      setVencimiento(addDays(fecha, 30));
    }
  }, [fecha, existing]);

  const addItem = () => setItems([...items, { descripcion: "", valor: 0 }]);

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof PresupuestoItem, value: string | number) => {
    const updated = [...items];
    if (field === "valor") {
      updated[index].valor = typeof value === "string" ? parseFloat(value) || 0 : value;
    } else {
      updated[index].descripcion = value as string;
    }
    setItems(updated);
  };

  const total = items.reduce((sum, item) => sum + item.valor, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const presupuesto: Presupuesto = {
      id: existing?.id ?? crypto.randomUUID(),
      numero: existing?.numero ?? getNextNumero(),
      fecha,
      vencimiento,
      cliente: { nombre: clienteNombre, direccion: clienteDireccion },
      vehiculo: { marca, tipo, modelo, patente },
      items,
      total,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    };

    savePresupuesto(presupuesto);
    router.push(`/presupuesto/${presupuesto.id}`);
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 focus:bg-white transition-all";
  const labelClass = "block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-extrabold text-gray-900 tracking-tight">
            {existing ? "Editar presupuesto" : "Nuevo presupuesto"}
          </h1>
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors">
            Cancelar
          </Link>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Fechas */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-4">Fechas</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Fecha</label>
              <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Vencimiento</label>
              <input type="date" value={vencimiento} onChange={(e) => setVencimiento(e.target.value)} className={inputClass} required />
            </div>
          </div>
        </div>

        {/* Cliente */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-4">Cliente</h2>
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Nombre</label>
              <input type="text" value={clienteNombre} onChange={(e) => setClienteNombre(e.target.value)} className={inputClass} placeholder="Nombre completo del cliente" required />
            </div>
            <div>
              <label className={labelClass}>Dirección / CP</label>
              <input type="text" value={clienteDireccion} onChange={(e) => setClienteDireccion(e.target.value)} className={inputClass} placeholder="Calle, localidad, código postal" />
            </div>
          </div>
        </div>

        {/* Vehículo */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-4">Datos del vehículo</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Marca</label>
              <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} className={inputClass} placeholder="Subaru" required />
            </div>
            <div>
              <label className={labelClass}>Tipo</label>
              <input type="text" value={tipo} onChange={(e) => setTipo(e.target.value)} className={inputClass} placeholder="Todo terreno" />
            </div>
            <div>
              <label className={labelClass}>Modelo</label>
              <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} className={inputClass} placeholder="Forester 2.5" required />
            </div>
            <div>
              <label className={labelClass}>Patente</label>
              <input type="text" value={patente} onChange={(e) => setPatente(e.target.value.toUpperCase())} className={inputClass} placeholder="AD 320 VO" required />
            </div>
          </div>
        </div>

        {/* Detalle */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Detalle</h2>
            <button
              type="button"
              onClick={addItem}
              className="text-xs font-semibold text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              + Agregar ítem
            </button>
          </div>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex gap-3 items-start p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex-1">
                  <label className={labelClass}>Descripción</label>
                  <textarea
                    value={item.descripcion}
                    onChange={(e) => updateItem(index, "descripcion", e.target.value)}
                    className={`${inputClass} resize-none !bg-white`}
                    rows={2}
                    placeholder="Descripción del trabajo o repuesto"
                    required
                  />
                </div>
                <div className="w-28 sm:w-36">
                  <label className={labelClass}>Valor ($)</label>
                  <input
                    type="number"
                    value={item.valor || ""}
                    onChange={(e) => updateItem(index, "valor", e.target.value)}
                    className={`${inputClass} !bg-white`}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="mt-7 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-5 pt-4 border-t border-gray-200 flex justify-between items-center">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Total</span>
            <span className="text-xl font-extrabold text-gray-900">
              ${total.toLocaleString("es-AR")}
            </span>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-gray-900 text-white font-semibold py-3.5 rounded-xl hover:bg-gray-800 active:scale-[0.99] transition-all text-sm shadow-sm"
        >
          {existing ? "Guardar cambios" : "Crear presupuesto"}
        </button>
      </form>
    </div>
  );
}
