"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Presupuesto } from "@/lib/types";
import { getPresupuesto } from "@/lib/storage";
import { padNumero } from "@/lib/utils";
import PresupuestoPDF from "@/components/PresupuestoPDF";

export default function VerPresupuestoPage() {
  const params = useParams();
  const router = useRouter();
  const pdfRef = useRef<HTMLDivElement>(null);
  const [presupuesto, setPresupuesto] = useState<Presupuesto | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const p = getPresupuesto(params.id as string);
    if (!p) {
      router.push("/");
      return;
    }
    setPresupuesto(p);
  }, [params.id, router]);

  const handleDownloadPDF = async () => {
    if (!pdfRef.current || !presupuesto) return;
    setDownloading(true);

    try {
      const mod = await import("html2pdf.js");
      const html2pdf = mod.default || mod;
      const filename = `Presupuesto-${padNumero(presupuesto.numero)}-${presupuesto.cliente.nombre.replace(/\s+/g, "-")}.pdf`;

      const element = pdfRef.current;
      await html2pdf(element, {
        margin: [10, 10, 10, 10],
        filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      });
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Error al generar el PDF. Intente de nuevo.");
    } finally {
      setDownloading(false);
    }
  };

  if (!presupuesto) return <div className="p-8 text-center text-gray-400">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors">
            ← Volver
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href={`/editar/${presupuesto.id}`}
              className="text-sm font-medium text-gray-500 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Editar
            </Link>
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="bg-gray-900 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-50 shadow-sm flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {downloading ? "Generando..." : "Descargar PDF"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div ref={pdfRef} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <PresupuestoPDF presupuesto={presupuesto} />
        </div>
      </main>
    </div>
  );
}
