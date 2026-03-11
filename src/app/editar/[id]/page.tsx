"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Presupuesto } from "@/lib/types";
import { getPresupuesto } from "@/lib/storage";
import PresupuestoForm from "@/components/PresupuestoForm";

export default function EditarPage() {
  const params = useParams();
  const router = useRouter();
  const [presupuesto, setPresupuesto] = useState<Presupuesto | null>(null);

  useEffect(() => {
    const p = getPresupuesto(params.id as string);
    if (!p) {
      router.push("/");
      return;
    }
    setPresupuesto(p);
  }, [params.id, router]);

  if (!presupuesto) return <div className="p-8 text-center text-gray-400">Cargando...</div>;

  return <PresupuestoForm existing={presupuesto} />;
}
