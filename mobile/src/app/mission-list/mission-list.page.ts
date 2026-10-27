import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { Mission, MissionService } from '../services/mission';
import { MissionFormPage } from '../mission-form/mission-form.page';

@Component({
  selector: 'app-mission-list',
  templateUrl: './mission-list.page.html',
  styleUrls: ['./mission-list.page.scss'],
  standalone: false,
})
export class MissionListPage implements OnInit {
  missions: Mission[] = [];

  busqueda: string = '';
  total: number = 0;
  paginaActual: number = 1;
  porPagina: number = 10;

  getCategoryName(cat: any): string {
    if (!cat) return '';
    return typeof cat === 'object' && cat.name ? cat.name : String(cat);
  }

  getStatusDescription(sta: any): string {
    if (!sta) return '';
    return typeof sta === 'object' && sta.description ? sta.description : String(sta);
  }

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private missionService: MissionService
  ) {}

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    this.cargarDatos();
  }

  async handleInput(event: CustomEvent<{ value?: string | null }>): Promise<void> {
    this.busqueda = event.detail.value ?? '';
    this.paginaActual = 1;
    await this.cargarDatos();
  }

  async cargarDatos(): Promise<void> {
    await Promise.all([this.cargarTotal(), this.loadMissions()]);
    this.ajustarPaginaActual();
  }

  async cargarTotal(): Promise<void> {
    try {
      this.total = await firstValueFrom(this.missionService.total(this.busqueda));
    } catch (error) {
      console.error('Error al obtener el total de misiones:', error);
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
    await this.loadMissions();
  }

  async loadMissions(): Promise<void> {
    try {
      this.missions = await firstValueFrom(
        this.missionService.listado(this.paginaActual, this.porPagina, this.busqueda)
      );
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.missions = [];
    }
  }


  async newMission(): Promise<void> {
    const modal = await this.modalController.create({
      component: MissionFormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      await this.cargarDatos();
    }
  }

  async editMission(id: number): Promise<void> {
    const modal = await this.modalController.create({
      component: MissionFormPage,
      componentProps: { misid: id },
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      await this.cargarDatos();
    }
  }

  async confirmarEliminar(id: number, title: string): Promise<void> {
    const alerta = await this.alertController.create({
      header: 'Eliminar misión',
      message: `¿Estás seguro de eliminar la misión "${title}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            void this.eliminarMission(id);
          }
        }
      ]
    });

    await alerta.present();
  }

  async eliminarMission(id: number): Promise<void> {
    try {
      await firstValueFrom(this.missionService.eliminar(id));

      const alerta = await this.alertController.create({
        header: 'Misión eliminada',
        message: 'La misión fue eliminada correctamente.',
        buttons: ['Aceptar']
      });

      await alerta.present();
      await alerta.onDidDismiss();

      await this.cargarDatos();
    } catch (error) {
      console.error('Error al eliminar la misión:', error);

      const alerta = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible eliminar la misión. Revisa la conexión y las relaciones del registro.',
        buttons: ['Aceptar']
      });

      await alerta.present();
    }
  }
}
