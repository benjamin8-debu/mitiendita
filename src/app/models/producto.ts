/**
 * models/producto.ts · QUÉ es un producto en nuestra app.
 * Una "interface" es un contrato: todo producto DEBE tener estos campos.
 */
export interface Producto {
  id: number;          // identificador único (lo pone el servicio)
  nombre: string;
  categoria: Categoria;
  precio: number;      // en soles
  stock: number;       // unidades disponibles
  creadoEn: string;    // fecha de registro (texto ISO: 2026-11-19T10:30:00.000Z)
}

/** Solo se permiten estas categorías (tipo "unión") */
export type Categoria = 'Abarrotes' | 'Bebidas' | 'Lácteos' | 'Limpieza' | 'Otros';
export const CATEGORIAS: Categoria[] = ['Abarrotes', 'Bebidas', 'Lácteos', 'Limpieza', 'Otros'];

/** Datos del formulario: todo menos id y fecha (esos los pone el servicio) */
export type ProductoNuevo = Omit<Producto, 'id' | 'creadoEn'>;
