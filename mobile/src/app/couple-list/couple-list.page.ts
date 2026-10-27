import { firstValueFrom } from 'rxjs';
import { CoupleService } from '../services/couple';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { CoupleFormPage } from '../couple-form/couple-form.page';

interface Couple {
  couid: number;
  start_date: string;
  total_xp: number;
  last_interaction: string;
}

interface ConteoDirectus {
  count: number | string;
}

interface ConteoDirectusResponse {
  data: ConteoDirectus[];
}

@Component({
  selector: 'app-couple-list',
  templateUrl: './couple-list.page.html',
  styleUrls: ['./couple-list.page.scss'],
  standalone: false,
})
export class CoupleListPage implements OnInit {
  couples: Couple[] = [];

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
    private alertController: AlertController, private coupleService: CoupleService) {}

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    this.cargarDatos();
  }

  async cargarDatos(): Promise<void> {
    await Promise.all([this.cargarTotal(), this.loadCouples()]);
    this.ajustarPaginaActual();
  }

  async cargarTotal(): Promise<void> {
    try {
      this.total = await firstValueFrom(this.coupleService.total(this.busqueda));
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
    await this.loadCouples();
  }

  async loadCouples(): Promise<void> {
    try {
      this.couples = await firstValueFrom(
        this.coupleService.listado(this.paginaActual, this.porPagina, this.busqueda)
      );
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.couples = [];
    }
  }


  async newCouple(): Promise<void> {
    const modal = await this.modalController.create({
      component: CoupleFormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      await this.cargarDatos();
    }
  }

  async editCouple(id: number): Promise<void> {
    const modal = await this.modalController.create({
      component: CoupleFormPage,
      componentProps: { couid: id },
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
      header: 'Eliminar pareja',
      message: `¿Estás seguro de eliminar el registro de pareja #${id}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            void this.eliminarCouple(id);
          }
        }
      ]
    });

    await alerta.present();
  }

  async eliminarCouple(id: number): Promise<void> {
    try {
      await firstValueFrom(this.coupleService.eliminar(id));

      const alerta = await this.alertController.create({
        header: 'Pareja eliminada',
        message: 'El registro de pareja fue eliminado correctamente.',
        buttons: ['Aceptar']
      });

      await alerta.present();
      await alerta.onDidDismiss();

      await this.cargarDatos();
    } catch (error) {
      console.error('Error al eliminar pareja:', error);

      const alerta = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible eliminar la pareja. Verifica si existen perfiles o misiones asociados.',
        buttons: ['Aceptar']
      });

      await alerta.present();
    }
  }
}
