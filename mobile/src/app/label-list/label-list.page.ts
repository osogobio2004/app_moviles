import { firstValueFrom } from 'rxjs';
import { LabelService } from '../services/label';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { LabelFormPage } from '../label-form/label-form.page';

interface LabelItem {
  labid: number;
  assigment_at: string;
  memidfk: number;
  tagidfk: number;
}

interface ConteoDirectus {
  count: number | string;
}

interface ConteoDirectusResponse {
  data: ConteoDirectus[];
}

@Component({
  selector: 'app-label-list',
  templateUrl: './label-list.page.html',
  styleUrls: ['./label-list.page.scss'],
  standalone: false,
})
export class LabelListPage implements OnInit {
  labels: LabelItem[] = [];

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
    private alertController: AlertController, private labelService: LabelService) {}

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    this.cargarDatos();
  }

  async cargarDatos(): Promise<void> {
    await Promise.all([this.cargarTotal(), this.loadLabels()]);
    this.ajustarPaginaActual();
  }

  async cargarTotal(): Promise<void> {
    try {
      this.total = await firstValueFrom(this.labelService.total(this.busqueda));
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
    await this.loadLabels();
  }

  async loadLabels(): Promise<void> {
    try {
      this.labels = await firstValueFrom(
        this.labelService.listado(this.paginaActual, this.porPagina, this.busqueda)
      );
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.labels = [];
    }
  }


  async newLabel(): Promise<void> {
    const modal = await this.modalController.create({
      component: LabelFormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      await this.cargarDatos();
    }
  }

  async editLabel(id: number): Promise<void> {
    const modal = await this.modalController.create({
      component: LabelFormPage,
      componentProps: { labid: id },
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
      header: 'Eliminar asignación',
      message: `¿Estás seguro de desvincular la etiqueta del recuerdo (ID #${id})?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            void this.eliminarLabel(id);
          }
        }
      ]
    });

    await alerta.present();
  }

  async eliminarLabel(id: number): Promise<void> {
    try {
      await firstValueFrom(this.labelService.eliminar(id));

      const alerta = await this.alertController.create({
        header: 'Asignación eliminada',
        message: 'La asignación fue eliminada correctamente.',
        buttons: ['Aceptar']
      });

      await alerta.present();
      await alerta.onDidDismiss();

      await this.cargarDatos();
    } catch (error) {
      console.error('Error al eliminar asignación:', error);

      const alerta = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible eliminar la asignación.',
        buttons: ['Aceptar']
      });

      await alerta.present();
    }
  }
}
