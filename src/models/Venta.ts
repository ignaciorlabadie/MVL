import { Producto } from "./Producto.js";

let nextVentaId = 1;

export function resetVentaId(counter: number) {
  nextVentaId = counter;
}

export class Venta {
  readonly id: number;
  readonly producto: Producto;
  readonly cantidad: number;
  readonly fecha: Date;

  constructor(producto: Producto, cantidad: number, id?: number, fecha?: Date) {
    this.id = id ?? nextVentaId++;
    this.producto = producto;
    this.cantidad = cantidad;
    this.fecha = fecha ?? new Date();
  }

  get total(): number {
    return this.producto.precio * this.cantidad;
  }
}
