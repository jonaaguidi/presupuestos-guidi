import { Presupuesto } from "./types";

const STORAGE_KEY = "presupuestos-guidi";
const COUNTER_KEY = "presupuestos-guidi-counter";

export function getPresupuestos(): Presupuesto[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function getPresupuesto(id: string): Presupuesto | undefined {
  return getPresupuestos().find((p) => p.id === id);
}

export function savePresupuesto(presupuesto: Presupuesto): void {
  const all = getPresupuestos();
  const index = all.findIndex((p) => p.id === presupuesto.id);
  if (index >= 0) {
    all[index] = presupuesto;
  } else {
    all.unshift(presupuesto);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function deletePresupuesto(id: string): void {
  const all = getPresupuestos().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function getNextNumero(): number {
  if (typeof window === "undefined") return 1;
  const current = localStorage.getItem(COUNTER_KEY);
  const next = current ? parseInt(current) + 1 : 23531;
  localStorage.setItem(COUNTER_KEY, next.toString());
  return next;
}
