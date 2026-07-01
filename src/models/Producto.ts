let nextId = 1;

export function resetProductoId(counter: number) {
  nextId = counter;
}

export abstract class Producto {
  readonly id: number;
  nombre: string;
  precio: number;
  color: string;

  constructor(nombre: string, precio: number, color: string, id?: number) {
    this.id = id ?? nextId++;
    this.nombre = nombre;
    this.precio = precio;
    this.color = color;
  }

  abstract tipo(): string;
}
