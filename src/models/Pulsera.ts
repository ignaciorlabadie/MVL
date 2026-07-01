import { Producto } from "./Producto.js";

export class Pulsera extends Producto {
  constructor(nombre: string, precio: number, color: string, id?: number) {
    super(nombre, precio, color, id);
  }

  tipo(): string {
    return "Pulsera";
  }
}
