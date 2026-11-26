/**
 * =====================================================================
 * pages/info/info.page.ts · "¿En qué celular estoy corriendo?"
 * ---------------------------------------------------------------------
 * Demuestra que la app corre DE VERDAD en tu celular (no en la PC):
 *   - @capacitor/device  → modelo, fabricante, versión de Android, batería
 *   - @capacitor/haptics → vibración
 * En el navegador de la PC verás "web"; en el celular, "android".
 * =====================================================================
 */
import { Component, inject, signal } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Device, DeviceInfo } from '@capacitor/device';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonNote, IonButton, IonIcon, IonChip,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { phonePortrait, pulse, bug } from 'ionicons/icons';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonNote, IonButton, IonIcon, IonChip],
})
export class InfoPage {
  servicio = inject(ProductosService);
  plataforma = Capacitor.getPlatform();   // 'android' | 'ios' | 'web'
  nativo = Capacitor.isNativePlatform();
  info = signal<DeviceInfo | null>(null);
  bateria = signal<number | null>(null);

  constructor() { addIcons({ phonePortrait, pulse, bug }); }

  /** Cada vez que se muestra la pestaña, leemos los datos del celular */
  async ionViewWillEnter(): Promise<void> {
    this.info.set(await Device.getInfo());
    const b = await Device.getBatteryInfo();
    this.bateria.set(b.batteryLevel != null ? Math.round(b.batteryLevel * 100) : null);
  }

  async vibrar(): Promise<void> {
    await Haptics.impact({ style: ImpactStyle.Heavy }).catch(() => {});
  }

  /** Mensaje para ver en chrome://inspect (depuración del celular desde la PC) */
  probarConsola(): void {
    console.log('👋 Hola desde', this.info()?.model, '· productos:', this.servicio.productos());
  }
}
