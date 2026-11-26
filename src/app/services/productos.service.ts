/**
 * =====================================================================
 * services/productos.service.ts · El "almacén" de la app
 * ---------------------------------------------------------------------
 * Un SERVICIO guarda datos y lógica que varias pantallas comparten.
 * providedIn: 'root' → existe UNO solo para toda la app: si la pestaña
 * Registrar agrega un producto, la pestaña Productos lo ve al instante.
 *
 * Los productos se guardan en el celular con @capacitor/preferences:
 * si cierras la app y la vuelves a abrir, siguen ahí.
 * Analogía: el cuaderno de la bodega que nunca se borra.
 * =====================================================================
 */
import { Injectable, computed, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Producto, ProductoNuevo } from '../models/producto';

const CLAVE = 'mitiendita.productos';

/** Productos de ejemplo para la primera vez que se abre la app */
const EJEMPLOS: Producto[] = [
  { id: 1, nombre: 'Arroz extra 5 kg', categoria: 'Abarrotes', precio: 22.9, stock: 15, creadoEn: new Date().toISOString() },
  { id: 2, nombre: 'Leche evaporada 400 g', categoria: 'Lácteos', precio: 4.1, stock: 48, creadoEn: new Date().toISOString() },
  { id: 3, nombre: 'Gaseosa 1.5 L', categoria: 'Bebidas', precio: 7.5, stock: 4, creadoEn: new Date().toISOString() },
];

@Injectable({ providedIn: 'root' })
export class ProductosService {
  // ---------- ESTADO (signal = "pizarra" que avisa a la pantalla cuando cambia) ----------
  private readonly _productos = signal<Producto[]>([]);
  readonly productos = this._productos.asReadonly();   // las pantallas solo LEEN

  // ---------- DATOS CALCULADOS (computed: se recalculan solos) ----------
  readonly total = computed(() => this._productos().length);
  readonly unidades = computed(() => this._productos().reduce((suma, p) => suma + p.stock, 0));
  readonly valorInventario = computed(() => this._productos().reduce((suma, p) => suma + p.precio * p.stock, 0));

  private cargado = false;

  /** LISTAR: lee del celular (solo la primera vez) */
  async cargar(): Promise<void> {
    if (this.cargado) return;
    const { value } = await Preferences.get({ key: CLAVE });   // texto guardado o null
    this._productos.set(value ? JSON.parse(value) : EJEMPLOS); // texto → arreglo
    this.cargado = true;
  }

  /** VER uno */
  buscar(id: number): Producto | undefined {
    return this._productos().find((p) => p.id === id);
  }

  /** REGISTRAR: valida, agrega y guarda. Devuelve null si todo salió bien o el mensaje de error */
  async registrar(datos: ProductoNuevo): Promise<string | null> {
    const error = this.validar(datos);
    if (error) return error;
    const nuevoId = Math.max(0, ...this._productos().map((p) => p.id)) + 1;
    const nuevo: Producto = { ...datos, nombre: datos.nombre.trim(), id: nuevoId, creadoEn: new Date().toISOString() };
    this._productos.update((lista) => [nuevo, ...lista]);   // el nuevo va primero
    await this.guardar();
    return null;
  }

  /** EDITAR */
  async actualizar(id: number, datos: ProductoNuevo): Promise<string | null> {
    const error = this.validar(datos);
    if (error) return error;
    this._productos.update((lista) => lista.map((p) => (p.id === id ? { ...p, ...datos, nombre: datos.nombre.trim() } : p)));
    await this.guardar();
    return null;
  }

  /** ELIMINAR */
  async eliminar(id: number): Promise<void> {
    this._productos.update((lista) => lista.filter((p) => p.id !== id));
    await this.guardar();
  }

  /** Reglas del negocio: aquí y en un solo lugar */
  private validar(d: ProductoNuevo): string | null {
    if (!d.nombre || d.nombre.trim().length < 3) return 'El nombre debe tener al menos 3 letras.';
    if (!(d.precio > 0)) return 'El precio debe ser mayor que 0.';
    if (!Number.isInteger(d.stock) || d.stock < 0) return 'El stock debe ser un número entero, 0 o más.';
    return null;
  }

  /** Escribe la lista en el celular (arreglo → texto JSON) */
  private async guardar(): Promise<void> {
    await Preferences.set({ key: CLAVE, value: JSON.stringify(this._productos()) });
  }
}
