import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth';
import { COLECCIONES } from './catalogos/colecciones.config';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false
})
export class AppComponent {
  enlaces = [
    { ruta: '/tabs/productos', texto: 'Productos' },
    { ruta: '/tabs/pedidos', texto: 'Pedidos' },
    { ruta: '/tabs/resumen', texto: 'Resumen' }
  ];
  catalogos = COLECCIONES.filter(c => c.tabla !== 'pedidos');

  tablasOriginales = [
    { ruta: '/mission-list', texto: 'Misiones' },
    { ruta: '/journey-list', texto: 'Viajes' },
    { ruta: '/memory-list', texto: 'Recuerdos' },
    { ruta: '/reward-list', texto: 'Recompensas' },
    { ruta: '/achievement-list', texto: 'Logros' },
    { ruta: '/profile-list', texto: 'Perfiles' },
    { ruta: '/category-list', texto: 'Categorías (Sistema)' },
    { ruta: '/status-list', texto: 'Estados' },
    { ruta: '/couple-list', texto: 'Parejas' },
    { ruta: '/rank-list', texto: 'Rangos' },
    { ruta: '/tag-list', texto: 'Etiquetas' },
    { ruta: '/step-list', texto: 'Pasos de Misión' },
    { ruta: '/location-list', texto: 'Ubicaciones' },
    { ruta: '/label-list', texto: 'Asignación Etiquetas' },
    { ruta: '/unlock-list', texto: 'Desbloqueos' },
    { ruta: '/inventory-list', texto: 'Inventario' },
    { ruta: '/token-list', texto: 'Tokens' },
    { ruta: '/images-list', texto: 'Imágenes' }
  ];

  constructor(public auth: AuthService, private router: Router) {}

  async salir(): Promise<void> {
    try {
      await this.auth.cerrarSesion();
    } finally {
      await this.router.navigateByUrl('/login', { replaceUrl: true });
    }
  }
}
