/**
 * =====================================================================
 * src/main.ts · Punto de arranque de MiTiendita
 * ---------------------------------------------------------------------
 * "Enciende" la app: le dice a Angular qué componente es la raíz
 * (AppComponent) y qué servicios generales estarán disponibles.
 * Analogía: el interruptor general de la casa.
 * =====================================================================
 */
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withComponentInputBinding } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    // Ionic guarda las páginas visitadas en una "pila": el botón Atrás es instantáneo
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // Activa los componentes <ion-...> con el estilo del sistema (Material en Android)
    provideIonicAngular(),
    // Activa las rutas. withComponentInputBinding: los parámetros de la URL llegan a los input()
    provideRouter(routes, withComponentInputBinding()),
  ],
}).catch((err) => console.error(err));
