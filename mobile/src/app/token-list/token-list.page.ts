import { firstValueFrom } from 'rxjs';
import { TokenService } from '../services/token';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { TokenFormPage } from '../token-form/token-form.page';

interface TokenItem {
  tokid: number;
  code: string;
  created_at: string;
  expires_at: string;
  is_used: number | boolean;
  couidfk: number;
}

interface ConteoDirectus {
  count: number | string;
}

interface ConteoDirectusResponse {
  data: ConteoDirectus[];
}

@Component({
  selector: 'app-token-list',
  templateUrl: './token-list.page.html',
  styleUrls: ['./token-list.page.scss'],
  standalone: false,
})
export class TokenListPage implements OnInit {
  tokens: TokenItem[] = [];

  busqueda: string = '';
  total: number = 0;
  paginaActual: number = 1;
  porPagina: number = 10;

  private parametrosBusqueda(): Record<string, string> {
    const texto = this.busqueda.trim();
    return texto ? {
      filter: JSON.stringify({
        code: { _icontains: texto }
      })
    } : {};
  }

  async handleInput(event: CustomEvent<{ value?: string | null }>): Promise<void> {
    this.busqueda = event.detail.value ?? '';
    this.paginaActual = 1;
    await this.cargarDatos();
  }

  constructor(private modalController: ModalController,
    private alertController: AlertController, private tokenService: TokenService) {}

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    this.cargarDatos();
  }

  async cargarDatos(): Promise<void> {
    await Promise.all([this.cargarTotal(), this.loadTokens()]);
    this.ajustarPaginaActual();
  }

  async cargarTotal(): Promise<void> {
    try {
      this.total = await firstValueFrom(this.tokenService.total(this.busqueda));
    } catch (error) {
      console.error('Error al obtener el total:', error);
      this.total = 0;
    }
  }

  private ajustarPaginaActual(): void {
    const totalPaginas = Math.ceil(this.total / this.porPagina);
    if (totalPaginas === 0) {
      this.paginaActual = 1;
      return;
    }
    if (this.paginaActual > totalPaginas) {
      this.paginaActual = totalPaginas;
    }
  }

  async cambiarPagina(pagina: number): Promise<void> {
    this.paginaActual = pagina;
    await this.loadTokens();
  }

  async loadTokens(): Promise<void> {
    try {
      this.tokens = await firstValueFrom(
        this.tokenService.listado(this.paginaActual, this.porPagina, this.busqueda)
      );
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.tokens = [];
    }
  }


  async newToken(): Promise<void> {
    const modal = await this.modalController.create({
      component: TokenFormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      await this.cargarDatos();
    }
  }

  async editToken(id: number): Promise<void> {
    const modal = await this.modalController.create({
      component: TokenFormPage,
      componentProps: { tokid: id },
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      await this.cargarDatos();
    }
  }

  async confirmarEliminar(id: number, code: string): Promise<void> {
    const alerta = await this.alertController.create({
      header: 'Eliminar token',
      message: `¿Estás seguro de eliminar el token "${code}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            void this.eliminarToken(id);
          }
        }
      ]
    });

    await alerta.present();
  }

  async eliminarToken(id: number): Promise<void> {
    try {
      await firstValueFrom(this.tokenService.eliminar(id));

      const alerta = await this.alertController.create({
        header: 'Token eliminado',
        message: 'El token fue eliminado correctamente.',
        buttons: ['Aceptar']
      });

      await alerta.present();
      await alerta.onDidDismiss();

      await this.cargarDatos();
    } catch (error) {
      console.error('Error al eliminar token:', error);

      const alerta = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible eliminar el token.',
        buttons: ['Aceptar']
      });

      await alerta.present();
    }
  }
}
