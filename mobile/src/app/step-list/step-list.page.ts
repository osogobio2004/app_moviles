import { firstValueFrom } from 'rxjs';
import { StepService } from '../services/step';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { StepFormPage } from '../step-form/step-form.page';

interface Step {
  steid: number;
  instruction: string;
  order_num: number;
  is_done: number | boolean;
  misidfk: number;
}

interface ConteoDirectus {
  count: number | string;
}

interface ConteoDirectusResponse {
  data: ConteoDirectus[];
}

@Component({
  selector: 'app-step-list',
  templateUrl: './step-list.page.html',
  styleUrls: ['./step-list.page.scss'],
  standalone: false,
})
export class StepListPage implements OnInit {
  steps: Step[] = [];

  busqueda: string = '';
  total: number = 0;
  paginaActual: number = 1;
  porPagina: number = 10;

  private parametrosBusqueda(): Record<string, string> {
    const texto = this.busqueda.trim();
    return texto ? {
      filter: JSON.stringify({
        instruction: { _icontains: texto }
      })
    } : {};
  }

  async handleInput(event: CustomEvent<{ value?: string | null }>): Promise<void> {
    this.busqueda = event.detail.value ?? '';
    this.paginaActual = 1;
    await this.cargarDatos();
  }

  constructor(private modalController: ModalController,
    private alertController: AlertController, private stepService: StepService) {}

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    this.cargarDatos();
  }

  async cargarDatos(): Promise<void> {
    await Promise.all([this.cargarTotal(), this.loadSteps()]);
    this.ajustarPaginaActual();
  }

  async cargarTotal(): Promise<void> {
    try {
      this.total = await firstValueFrom(this.stepService.total(this.busqueda));
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
    await this.loadSteps();
  }

  async loadSteps(): Promise<void> {
    try {
      this.steps = await firstValueFrom(
        this.stepService.listado(this.paginaActual, this.porPagina, this.busqueda)
      );
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.steps = [];
    }
  }


  async newStep(): Promise<void> {
    const modal = await this.modalController.create({
      component: StepFormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      await this.cargarDatos();
    }
  }

  async editStep(id: number): Promise<void> {
    const modal = await this.modalController.create({
      component: StepFormPage,
      componentProps: { steid: id },
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      await this.cargarDatos();
    }
  }

  async confirmarEliminar(id: number, instruction: string): Promise<void> {
    const preview = instruction.length > 30 ? instruction.substring(0, 30) + '...' : instruction;
    const alerta = await this.alertController.create({
      header: 'Eliminar paso',
      message: `¿Estás seguro de eliminar el paso "${preview}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            void this.eliminarStep(id);
          }
        }
      ]
    });

    await alerta.present();
  }

  async eliminarStep(id: number): Promise<void> {
    try {
      await firstValueFrom(this.stepService.eliminar(id));

      const alerta = await this.alertController.create({
        header: 'Paso eliminado',
        message: 'El paso fue eliminado correctamente.',
        buttons: ['Aceptar']
      });

      await alerta.present();
      await alerta.onDidDismiss();

      await this.cargarDatos();
    } catch (error) {
      console.error('Error al eliminar paso:', error);

      const alerta = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible eliminar el paso.',
        buttons: ['Aceptar']
      });

      await alerta.present();
    }
  }
}
