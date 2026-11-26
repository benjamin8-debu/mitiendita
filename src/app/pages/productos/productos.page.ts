/**
 * =====================================================================
 * pages/productos/productos.page.ts · LISTAR, BUSCAR y ELIMINAR
 * =====================================================================
 */
import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonList, IonItem, IonItemSliding, IonItemOptions,
  IonItemOption, IonLabel, IonBadge, IonIcon, IonFab, IonFabButton, IonRefresher, IonRefresherContent, IonNote,
  IonSegment, IonSegmentButton, IonButtons, IonButton, AlertController, ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, trash, cubeOutline, swapVertical } from 'ionicons/icons';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { ProductosService } from '../../services/productos.service';
import { CATEGORIAS, Categoria, Producto } from '../../models/producto';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  imports: [CurrencyPipe, RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonList, IonItem,
    IonItemSliding, IonItemOptions, IonItemOption, IonLabel, IonBadge, IonIcon, IonFab, IonFabButton, IonRefresher,
    IonRefresherContent, IonNote, IonSegment, IonSegmentButton, IonButtons, IonButton],
})
export class ProductosPage {
  servicio = inject(ProductosService);
  private alertas = inject(AlertController);
  private toast = inject(ToastController);

  /** Texto del buscador */
  texto = signal('');
  /** Reto 1: categoría elegida en el ion-segment */
  categorias = CATEGORIAS;
  categoria = signal<Categoria | 'Todas'>('Todas');
  /** Reto 2: criterio de orden */
  orden = signal<'nombre' | 'precio'>('nombre');

  /** Lista filtrada y ordenada: se recalcula sola al escribir, filtrar, ordenar o cambiar los productos */
  filtrados = computed(() => this.servicio.productos()
    .filter((p) => p.nombre.toLowerCase().includes(this.texto().toLowerCase()))
    .filter((p) => this.categoria() === 'Todas' || p.categoria === this.categoria())
    .slice()
    .sort((a, b) => this.orden() === 'precio' ? a.precio - b.precio : a.nombre.localeCompare(b.nombre)));

  constructor() {
    addIcons({ add, trash, cubeOutline, swapVertical });
    this.servicio.cargar();   // LISTAR: lee los productos guardados en el celular
  }

  /** (ionInput): se ejecuta mientras escribes en el buscador */
  alBuscar(evento: CustomEvent): void {
    this.texto.set(evento.detail.value ?? '');
  }

  /** Reto 1: (ionChange) del segment */
  alCambiarCategoria(evento: CustomEvent): void {
    this.categoria.set(evento.detail.value);
  }

  /** Reto 2: alterna entre ordenar por nombre y por precio */
  cambiarOrden(): void {
    this.orden.update((o) => (o === 'nombre' ? 'precio' : 'nombre'));
  }

  /** ELIMINAR: primero pregunta, luego borra y vibra */
  async eliminar(p: Producto, fila: IonItemSliding): Promise<void> {
    await fila.close();
    const alerta = await this.alertas.create({
      header: '¿Eliminar producto?',
      message: `Se eliminará "${p.nombre}".`,
      buttons: [{ text: 'Cancelar', role: 'cancel' }, { text: 'Eliminar', role: 'destructive' }],
    });
    await alerta.present();
    const { role } = await alerta.onDidDismiss();
    if (role !== 'destructive') return;

    await this.servicio.eliminar(p.id);
    await Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {});   // vibra en el celular (en la PC no hace nada)
    console.log('Producto eliminado:', p);                                 // míralo en chrome://inspect
    (await this.toast.create({ message: `"${p.nombre}" eliminado`, duration: 1500, color: 'medium' })).present();
  }

  /** Jalar hacia abajo para refrescar */
  async refrescar(evento: CustomEvent): Promise<void> {
    await new Promise((ok) => setTimeout(ok, 600));   // pequeña pausa para que se vea la animación
    (evento.target as HTMLIonRefresherElement).complete();
  }
}
