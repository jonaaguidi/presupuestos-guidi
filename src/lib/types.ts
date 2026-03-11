export interface PresupuestoItem {
  descripcion: string;
  valor: number;
}

export interface Presupuesto {
  id: string;
  numero: number;
  fecha: string;
  vencimiento: string;
  cliente: {
    nombre: string;
    direccion: string;
  };
  vehiculo: {
    marca: string;
    tipo: string;
    modelo: string;
    patente: string;
  };
  items: PresupuestoItem[];
  total: number;
  createdAt: string;
}
