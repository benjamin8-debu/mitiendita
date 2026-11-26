/**
 * =====================================================================
 * pages/registrar/registrar.page.ts · REGISTRAR y EDITAR
 * ---------------------------------------------------------------------
 * La misma pantalla sirve para dos cosas:
 *   /tabs/registrar → crear un producto nuevo
 *   /editar/5       → editar el producto 5 (llega el parámetro id)
 * =====================================================================
 */
import { Component, OnInit, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonInput, IonSelect, IonSelectOption,
  IonButton, IonIcon, NavController, ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { save } from 'ionicons/icons';
import { ProductosService } from '../../services/productos.service';
import { CATEGORIAS, ProductoNuevo } from '../../models/producto';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonInput, IonSelect,
    IonSelectOption, IonButton, IonIcon],
})
export class RegistrarPage implements OnInit {
  private servicio = inject(ProductosService);
  private nav = inject(NavController);
  private toast = inject(ToastController);

  /** Parámetro de la URL /editar/:id (si no viene, estamos registrando) */
  id = input<string>();
  categorias = CATEGORIAS;

  /** Datos enlazados al formulario con [(ngModel)] */
  datos: ProductoNuevo = this.vacio();

  get editando(): boolean { return !!this.id(); }

  constructor() { addIcons({ save }); }

  async ngOnInit(): Promise<void> {
    await this.servicio.cargar();
    const p = this.editando ? this.servicio.buscar(Number(this.id())) : undefined;   // Number(): la URL trae texto
    if (p) this.datos = { nombre: p.nombre, categoria: p.categoria, precio: p.precio, stock: p.stock };
  }

  async guardar(): Promise<void> {
    // Convertimos a número por si el input entrega texto
    const datos = { ...this.datos, precio: Number(this.datos.precio), stock: Number(this.datos.stock) };
    const error = this.editando
      ? await this.servicio.actualizar(Number(this.id()), datos)
      : await this.servicio.registrar(datos);

    if (error) {   // la validación falló: avisamos y no salimos
      (await this.toast.create({ message: error, duration: 2000, color: 'warning' })).present();
      return;
    }
    (await this.toast.create({ message: this.editando ? 'Cambios guardados ✔' : 'Producto registrado ✔', duration: 1500, color: 'success' })).present();
    this.datos = this.vacio();                  // limpia el formulario
    this.nav.navigateRoot('/tabs/productos');   // vuelve a la lista
  }

  private vacio(): ProductoNuevo {
    return { nombre: '', categoria: 'Abarrotes', precio: 0, stock: 0 };
  }
}
