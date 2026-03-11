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
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1";

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">
            {existing ? "Editar presupuesto" : "Nuevo presupuesto"}
          </h1>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            Cancelar
          </Link>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Fechas */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-bold text-gray-900 mb-3">Fechas</h2>
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
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-bold text-gray-900 mb-3">Cliente</h2>
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Nombre</label>
              <input type="text" value={clienteNombre} onChange={(e) => setClienteNombre(e.target.value)} className={inputClass} placeholder="Nombre del cliente" required />
            </div>
            <div>
              <label className={labelClass}>Dirección / CP</label>
              <input type="text" value={clienteDireccion} onChange={(e) => setClienteDireccion(e.target.value)} className={inputClass} placeholder="Dirección completa" />
            </div>
          </div>
        </div>

        {/* Vehículo */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-bold text-gray-900 mb-3">Datos del vehículo</h2>
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
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-900">Detalle</h2>
            <button
              type="button"
              onClick={addItem}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
            >
              + Agregar ítem
            </button>
          </div>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1">
                  <label className={labelClass}>Descripción</label>
                  <textarea
                    value={item.descripcion}
                    onChange={(e) => updateItem(index, "descripcion", e.target.value)}
                    className={`${inputClass} resize-none`}
                    rows={2}
                    placeholder="Descripción del trabajo o repuesto"
                    required
                  />
                </div>
                <div className="w-32 sm:w-40">
                  <label className={labelClass}>Valor ($)</label>
                  <input
                    type="number"
                    value={item.valor || ""}
                    onChange={(e) => updateItem(index, "valor", e.target.value)}
                    className={inputClass}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="mt-6 text-red-400 hover:text-red-600 p-1"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm font-bold text-gray-900">TOTAL</span>
            <span className="text-lg font-bold text-gray-900">
              ${total.toLocaleString("es-AR")}
            </span>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-3 rounded-xl hover:bg-blue-700 transition-colors text-sm"
        >
          {existing ? "Guardar cambios" : "Crear presupuesto"}
        </button>
      </form>
    </div>
  );
}
