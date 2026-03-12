"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Presupuesto } from "@/lib/types";
import { getPresupuestos, deletePresupuesto } from "@/lib/storage";
import { formatCurrency, formatDate, padNumero } from "@/lib/utils";

export default function Home() {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setPresupuestos(getPresupuestos());
    setLoaded(true);
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm("¿Eliminar este presupuesto?")) return;
    deletePresupuesto(id);
    setPresupuestos(getPresupuestos());
  };

  const filtered = presupuestos.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.cliente.nombre.toLowerCase().includes(q) ||
      p.vehiculo.marca.toLowerCase().includes(q) ||
      p.vehiculo.modelo.toLowerCase().includes(q) ||
      p.vehiculo.patente.toLowerCase().includes(q) ||
      padNumero(p.numero).includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">Presupuestos</h1>
            <p className="text-[11px] text-gray-400 font-medium">Fernando D. Guidi — Taller Integral</p>
          </div>
          <Link
            href="/nuevo"
            className="bg-gray-900 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-800 active:scale-95 transition-all shadow-sm"
          >
            + Nuevo
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-5">
        {!loaded ? (
          <div className="text-center py-12 text-gray-400">Cargando...</div>
        ) : presupuestos.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium mb-1">No hay presupuestos</p>
            <p className="text-sm text-gray-400 mb-5">Creá tu primer presupuesto para empezar</p>
            <Link
              href="/nuevo"
              className="inline-block bg-gray-900 text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
            >
              Crear presupuesto
            </Link>
          </div>
        ) : (
          <>
            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por cliente, vehículo, patente..."
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-colors shadow-sm"
              />
            </div>

            {/* Count */}
            <p className="text-xs text-gray-400 mb-3 px-1">
              {filtered.length} {filtered.length === 1 ? "presupuesto" : "presupuestos"}
            </p>

            {/* List */}
            <div className="space-y-2.5">
              {filtered.map((p) => (
                <Link
                  key={p.id}
                  href={`/presupuesto/${p.id}`}
                  className="block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all active:scale-[0.99]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-mono font-semibold bg-gray-900 text-white px-2 py-0.5 rounded">
                          N° {padNumero(p.numero)}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {formatDate(p.fecha)}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900 truncate text-[15px]">
                        {p.cliente.nombre}
                      </p>
                      <p className="text-sm text-gray-400 truncate">
                        {p.vehiculo.marca} {p.vehiculo.modelo} — <span className="font-mono">{p.vehiculo.patente}</span>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-gray-900 text-[15px]">
                        {formatCurrency(p.total)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100">
                    <span
                      className="text-xs font-medium text-gray-500 hover:text-gray-800 px-2.5 py-1 rounded-md hover:bg-gray-100 transition-colors"
                      onClick={(e) => { e.preventDefault(); window.location.href = `/editar/${p.id}`; }}
                    >
                      Editar
                    </span>
                    <span
                      onClick={(e) => { e.preventDefault(); handleDelete(p.id); }}
                      className="text-xs font-medium text-red-400 hover:text-red-600 px-2.5 py-1 rounded-md hover:bg-red-50 transition-colors ml-auto"
                    >
                      Eliminar
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
