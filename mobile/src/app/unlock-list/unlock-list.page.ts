import { firstValueFrom } from 'rxjs';
import { UnlockService } from '../services/unlock';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { UnlockFormPage } from '../unlock-form/unlock-form.page';

interface UnlockItem {
  unlid: number;
  unlocked_at: string;
  couidfk: number;
  achidfk: number;
}

interface ConteoDirectus {
  count: number | string;
}

interface ConteoDirectusResponse {
  data: ConteoDirectus[];
}

@Component({
  selector: 'app-unlock-list',
  templateUrl: './unlock-list.page.html',
  styleUrls: ['./unlock-list.page.scss'],
  standalone: false,
})
export class UnlockListPage implements OnInit {
  unlocks: UnlockItem[] = [];

  busqueda: string = '';
  total: number = 0;
  paginaActual: number = 1;
  porPagina: number = 10;

  private parametrosBusqueda(): Record<string, string> {
    const texto = this.busqueda.trim();
    return texto ? { search: texto } : {};
  }

  async handleInput(event: CustomEvent<{ value?: string | null }>): Promise<void> {
    this.busqueda = event.detail.value ?? '';
    this.paginaActual = 1;
    await this.cargarDatos();
  }

  constructor(private modalController: ModalController,
    private alertController: AlertController, private unlockService: UnlockService) {}

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    this.cargarDatos();
  }

  async cargarDatos(): Promise<void> {
    await Promise.all([this.cargarTotal(), this.loadUnlocks()]);
    this.ajustarPaginaActual();
  }

  async cargarTotal(): Promise<void> {
    try {
      this.total = await firstValueFrom(this.unlockService.total(this.busqueda));
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
    await this.loadUnlocks();
  }

  async loadUnlocks(): Promise<void> {
    try {
      this.unlocks = await firstValueFrom(
        this.unlockService.listado(this.paginaActual, this.porPagina, this.busqueda)
      );
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.unlocks = [];
    }
  }


  async newUnlock(): Promise<void> {
    const modal = await this.modalController.create({
      component: UnlockFormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      await this.cargarDatos();
    }
  }

  async editUnlock(id: number): Promise<void> {
    const modal = await this.modalController.create({
      component: UnlockFormPage,
      componentProps: { unlid: id },
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      await this.cargarDatos();
    }
  }

  async confirmarEliminar(id: number): Promise<void> {
    const alerta = await this.alertController.create({
      header: 'Eliminar desbloqueo',
      message: `¿Estás seguro de eliminar el registro de desbloqueo #${id}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            void this.eliminarUnlock(id);
          }
        }
      ]
    });

    await alerta.present();
  }

  async eliminarUnlock(id: number): Promise<void> {
    try {
      await firstValueFrom(this.unlockService.eliminar(id));

      const alerta = await this.alertController.create({
        header: 'Desbloqueo eliminado',
        message: 'El registro fue eliminado correctamente.',
        buttons: ['Aceptar']
      });

      await alerta.present();
      await alerta.onDidDismiss();

      await this.cargarDatos();
    } catch (error) {
      console.error('Error al eliminar desbloqueo:', error);

      const alerta = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible eliminar el desbloqueo.',
        buttons: ['Aceptar']
      });

      await alerta.present();
    }
  }
}
