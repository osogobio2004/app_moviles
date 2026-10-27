import { firstValueFrom } from 'rxjs';
import { JourneyService } from '../services/journey';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { JourneyFormPage } from '../journey-form/journey-form.page';

interface Status {
  staid: number;
  description: string;
}

interface Journey {
  jouid: number;
  destination: string;
  budget: number;
  planned_day: string;
  couidfk: number;
  staidfk: any;
  visited_at?: string | null;
}

interface ConteoDirectus {
  count: number | string;
}

interface ConteoDirectusResponse {
  data: ConteoDirectus[];
}

@Component({
  selector: 'app-journey-list',
  templateUrl: './journey-list.page.html',
  styleUrls: ['./journey-list.page.scss'],
  standalone: false,
})
export class JourneyListPage implements OnInit {
  journeys: Journey[] = [];

  busqueda: string = '';
  total: number = 0;
  paginaActual: number = 1;
  porPagina: number = 10;

  private parametrosBusqueda(): Record<string, string> {
    const texto = this.busqueda.trim();
    return texto ? {
      filter: JSON.stringify({
        destination: { _icontains: texto }
      })
    } : {};
  }

  async handleInput(event: CustomEvent<{ value?: string | null }>): Promise<void> {
    this.busqueda = event.detail.value ?? '';
    this.paginaActual = 1;
    await this.cargarDatos();
  }

  constructor(private modalController: ModalController,
    private alertController: AlertController, private journeyService: JourneyService) {}

  getStatusDescription(sta: any): string {
    if (!sta) return 'Sin estado';
    return typeof sta === 'object' && sta.description ? sta.description : String(sta);
  }

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    this.cargarDatos();
  }

  async cargarDatos(): Promise<void> {
    await Promise.all([this.cargarTotal(), this.loadJourneys()]);
    this.ajustarPaginaActual();
  }

  async cargarTotal(): Promise<void> {
    try {
      this.total = await firstValueFrom(this.journeyService.total(this.busqueda));
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
    await this.loadJourneys();
  }

  async loadJourneys(): Promise<void> {
    try {
      this.journeys = await firstValueFrom(
        this.journeyService.listado(this.paginaActual, this.porPagina, this.busqueda)
      );
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.journeys = [];
    }
  }


  async newJourney(): Promise<void> {
    const modal = await this.modalController.create({
      component: JourneyFormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      await this.cargarDatos();
    }
  }

  async editJourney(id: number): Promise<void> {
    const modal = await this.modalController.create({
      component: JourneyFormPage,
      componentProps: { jouid: id },
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      await this.cargarDatos();
    }
  }

  async confirmarEliminar(id: number, destination: string): Promise<void> {
    const alerta = await this.alertController.create({
      header: 'Eliminar viaje',
      message: `¿Estás seguro de eliminar el viaje a "${destination}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            void this.eliminarJourney(id);
          }
        }
      ]
    });

    await alerta.present();
  }

  async eliminarJourney(id: number): Promise<void> {
    try {
      await firstValueFrom(this.journeyService.eliminar(id));

      const alerta = await this.alertController.create({
        header: 'Viaje eliminado',
        message: 'El viaje fue eliminado correctamente.',
        buttons: ['Aceptar']
      });

      await alerta.present();
      await alerta.onDidDismiss();

      await this.cargarDatos();
    } catch (error) {
      console.error('Error al eliminar viaje:', error);

      const alerta = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible eliminar el viaje. Revisa la conexión y las relaciones del registro.',
        buttons: ['Aceptar']
      });

      await alerta.present();
    }
  }
}
