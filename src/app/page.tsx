"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Presupuesto } from "@/lib/types";
import { getPresupuestos, deletePresupuesto } from "@/lib/storage";
import { formatCurrency, formatDate, padNumero } from "@/lib/utils";

export default function Home() {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setPresupuestos(getPresupuestos());
    setLoaded(true);
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm("¿Eliminar este presupuesto?")) return;
    deletePresupuesto(id);
    setPresupuestos(getPresupuestos());
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Presupuestos Guidi</h1>
            <p className="text-xs text-gray-500">Taller Integral</p>
          </div>
          <Link
            href="/nuevo"
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Nuevo
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {!loaded ? (
          <div className="text-center py-12 text-gray-400">Cargando...</div>
        ) : presupuestos.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-gray-500 mb-4">No hay presupuestos creados</p>
            <Link
              href="/nuevo"
              className="inline-block bg-blue-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear primer presupuesto
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {presupuestos.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        N° {padNumero(p.numero)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(p.fecha)}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-900 truncate">
                      {p.cliente.nombre}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {p.vehiculo.marca} {p.vehiculo.modelo} — {p.vehiculo.patente}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-gray-900">
                      {formatCurrency(p.total)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                  <Link
                    href={`/presupuesto/${p.id}`}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    Ver
                  </Link>
                  <Link
                    href={`/editar/${p.id}`}
                    className="text-xs font-medium text-gray-600 hover:text-gray-800 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-xs font-medium text-red-500 hover:text-red-700 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors ml-auto"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
