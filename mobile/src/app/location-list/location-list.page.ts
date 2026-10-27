import { firstValueFrom } from 'rxjs';
import { LocationService } from '../services/location';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { LocationFormPage } from '../location-form/location-form.page';

interface LocationItem {
  locid: number;
  place_name: string;
  latitude?: number | null;
  longitude?: number | null;
  jouidfk: number;
}

interface ConteoDirectus {
  count: number | string;
}

interface ConteoDirectusResponse {
  data: ConteoDirectus[];
}

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.page.html',
  styleUrls: ['./location-list.page.scss'],
  standalone: false,
})
export class LocationListPage implements OnInit {
  locations: LocationItem[] = [];

  busqueda: string = '';
  total: number = 0;
  paginaActual: number = 1;
  porPagina: number = 10;

  private parametrosBusqueda(): Record<string, string> {
    const texto = this.busqueda.trim();
    return texto ? {
      filter: JSON.stringify({
        place_name: { _icontains: texto }
      })
    } : {};
  }

  async handleInput(event: CustomEvent<{ value?: string | null }>): Promise<void> {
    this.busqueda = event.detail.value ?? '';
    this.paginaActual = 1;
    await this.cargarDatos();
  }

  constructor(private modalController: ModalController,
    private alertController: AlertController, private locationService: LocationService) {}

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    this.cargarDatos();
  }

  async cargarDatos(): Promise<void> {
    await Promise.all([this.cargarTotal(), this.loadLocations()]);
    this.ajustarPaginaActual();
  }

  async cargarTotal(): Promise<void> {
    try {
      this.total = await firstValueFrom(this.locationService.total(this.busqueda));
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
    await this.loadLocations();
  }

  async loadLocations(): Promise<void> {
    try {
      this.locations = await firstValueFrom(
        this.locationService.listado(this.paginaActual, this.porPagina, this.busqueda)
      );
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.locations = [];
    }
  }


  async newLocation(): Promise<void> {
    const modal = await this.modalController.create({
      component: LocationFormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      await this.cargarDatos();
    }
  }

  async editLocation(id: number): Promise<void> {
    const modal = await this.modalController.create({
      component: LocationFormPage,
      componentProps: { locid: id },
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      await this.cargarDatos();
    }
  }

  async confirmarEliminar(id: number, placeName: string): Promise<void> {
    const alerta = await this.alertController.create({
      header: 'Eliminar ubicación',
      message: `¿Estás seguro de eliminar el lugar "${placeName}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            void this.eliminarLocation(id);
          }
        }
      ]
    });

    await alerta.present();
  }

  async eliminarLocation(id: number): Promise<void> {
    try {
      await firstValueFrom(this.locationService.eliminar(id));

      const alerta = await this.alertController.create({
        header: 'Ubicación eliminada',
        message: 'El lugar fue eliminado correctamente.',
        buttons: ['Aceptar']
      });

      await alerta.present();
      await alerta.onDidDismiss();

      await this.cargarDatos();
    } catch (error) {
      console.error('Error al eliminar ubicación:', error);

      const alerta = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible eliminar el lugar.',
        buttons: ['Aceptar']
      });

      await alerta.present();
    }
  }
}
