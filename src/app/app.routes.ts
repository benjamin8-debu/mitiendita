/**
 * =====================================================================
 * app.routes.ts · MAPA DE LA APP (qué pantalla se ve en cada dirección)
 * ---------------------------------------------------------------------
 * /tabs/productos  → lista de productos           (pestaña 1)
 * /tabs/registrar  → formulario para registrar    (pestaña 2)
 * /tabs/info       → información del celular      (pestaña 3)
 * /producto/5      → detalle del producto 5       (pantalla encima de las pestañas)
 * /editar/5        → formulario para editar el 5
 * loadComponent + import() = "carga perezosa": la pantalla se descarga al visitarla.
 * =====================================================================
 */
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.page').then((m) => m.TabsPage),
    children: [   // rutas HIJAS: se dibujan dentro de las pestañas
      { path: 'productos', loadComponent: () => import('./pages/productos/productos.page').then((m) => m.ProductosPage) },
      { path: 'registrar', loadComponent: () => import('./pages/registrar/registrar.page').then((m) => m.RegistrarPage) },
      { path: 'info', loadComponent: () => import('./pages/info/info.page').then((m) => m.InfoPage) },
      { path: '', redirectTo: 'productos', pathMatch: 'full' },
    ],
  },
  // :id = parte variable de la dirección (route param)
  { path: 'producto/:id', loadComponent: () => import('./pages/detalle/detalle.page').then((m) => m.DetallePage) },
  { path: 'editar/:id', loadComponent: () => import('./pages/registrar/registrar.page').then((m) => m.RegistrarPage) },
  { path: '', redirectTo: 'tabs/productos', pathMatch: 'full' },   // al abrir la app
  { path: '**', redirectTo: 'tabs/productos' },                    // cualquier dirección rara
];
