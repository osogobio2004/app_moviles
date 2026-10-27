import { firstValueFrom } from 'rxjs';
import { StatusService } from '../services/status';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { StatusFormPage } from '../status-form/status-form.page';

interface Status {
  staid: number;
  description: 'PENDIENTE' | 'EN PROGRESO' | 'COMPLETADO';
}

interface ConteoDirectus {
  count: number | string;
}

interface ConteoDirectusResponse {
  data: ConteoDirectus[];
}

@Component({
  selector: 'app-status-list',
  templateUrl: './status-list.page.html',
  styleUrls: ['./status-list.page.scss'],
  standalone: false,
})
export class StatusListPage implements OnInit {
  statuses: Status[] = [];

  busqueda: string = '';
  total: number = 0;
  paginaActual: number = 1;
  porPagina: number = 10;

  private parametrosBusqueda(): Record<string, string> {
    const texto = this.busqueda.trim();
    return texto ? {
      filter: JSON.stringify({
        description: { _contains: texto }
      })
    } : {};
  }

  async handleInput(event: CustomEvent<{ value?: string | null }>): Promise<void> {
    this.busqueda = event.detail.value ?? '';
    this.paginaActual = 1;
    await this.cargarDatos();
  }

  constructor(private modalController: ModalController,
    private alertController: AlertController, private statusService: StatusService) {}

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    this.cargarDatos();
  }

  async cargarDatos(): Promise<void> {
    await Promise.all([this.cargarTotal(), this.loadStatuses()]);
    this.ajustarPaginaActual();
  }

  async cargarTotal(): Promise<void> {
    try {
      this.total = await firstValueFrom(this.statusService.total(this.busqueda));
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
    await this.loadStatuses();
  }

  async loadStatuses(): Promise<void> {
    try {
      this.statuses = await firstValueFrom(
        this.statusService.listado(this.paginaActual, this.porPagina, this.busqueda)
      );
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.statuses = [];
    }
  }


  async newStatus(): Promise<void> {
    const modal = await this.modalController.create({
      component: StatusFormPage,
      breakpoints: [0, 0.4, 0.7],
      initialBreakpoint: 0.7
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      await this.cargarDatos();
    }
  }

  async editStatus(id: number): Promise<void> {
    const modal = await this.modalController.create({
      component: StatusFormPage,
      componentProps: { staid: id },
      breakpoints: [0, 0.4, 0.7],
      initialBreakpoint: 0.7
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      await this.cargarDatos();
    }
  }

  async confirmarEliminar(id: number, desc: string): Promise<void> {
    const alerta = await this.alertController.create({
      header: 'Eliminar estado',
      message: `¿Estás seguro de eliminar el estado "${desc}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            void this.eliminarStatus(id);
          }
        }
      ]
    });

    await alerta.present();
  }

  async eliminarStatus(id: number): Promise<void> {
    try {
      await firstValueFrom(this.statusService.eliminar(id));

      const alerta = await this.alertController.create({
        header: 'Estado eliminado',
        message: 'El estado fue eliminado correctamente.',
        buttons: ['Aceptar']
      });

      await alerta.present();
      await alerta.onDidDismiss();

      await this.cargarDatos();
    } catch (error) {
      console.error('Error al eliminar estado:', error);

      const alerta = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible eliminar el estado. Podría estar asignado a misiones o viajes.',
        buttons: ['Aceptar']
      });

      await alerta.present();
    }
  }
}
