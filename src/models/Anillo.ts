import { Producto } from "./Producto.js";

export class Anillo extends Producto {
  constructor(nombre: string, precio: number, color: string, id?: number) {
    super(nombre, precio, color, id);
  }

  tipo(): string {
    return "Anillo";
  }
}
