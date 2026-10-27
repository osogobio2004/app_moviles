import { firstValueFrom } from 'rxjs';
import { AchievementService } from '../services/achievement';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { AchievementFormPage } from '../achievement-form/achievement-form.page';

interface Achievement {
  achid: number;
  name: string;
  criteria: any;
  xp_bonus: number;
}

interface ConteoDirectus {
  count: number | string;
}

interface ConteoDirectusResponse {
  data: ConteoDirectus[];
}

@Component({
  selector: 'app-achievement-list',
  templateUrl: './achievement-list.page.html',
  styleUrls: ['./achievement-list.page.scss'],
  standalone: false,
})
export class AchievementListPage implements OnInit {
  achievements: Achievement[] = [];

  busqueda: string = '';
  total: number = 0;
  paginaActual: number = 1;
  porPagina: number = 10;

  private parametrosBusqueda(): Record<string, string> {
    const texto = this.busqueda.trim();
    return texto ? {
      filter: JSON.stringify({
        name: { _icontains: texto }
      })
    } : {};
  }

  async handleInput(event: CustomEvent<{ value?: string | null }>): Promise<void> {
    this.busqueda = event.detail.value ?? '';
    this.paginaActual = 1;
    await this.cargarDatos();
  }

  constructor(private modalController: ModalController,
    private alertController: AlertController, private achievementService: AchievementService) {}

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    this.cargarDatos();
  }

  async cargarDatos(): Promise<void> {
    await Promise.all([this.cargarTotal(), this.loadAchievements()]);
    this.ajustarPaginaActual();
  }

  async cargarTotal(): Promise<void> {
    try {
      this.total = await firstValueFrom(this.achievementService.total(this.busqueda));
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
    await this.loadAchievements();
  }

  async loadAchievements(): Promise<void> {
    try {
      this.achievements = await firstValueFrom(
        this.achievementService.listado(this.paginaActual, this.porPagina, this.busqueda)
      );
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.achievements = [];
    }
  }


  async newAchievement(): Promise<void> {
    const modal = await this.modalController.create({
      component: AchievementFormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      await this.cargarDatos();
    }
  }

  async editAchievement(id: number): Promise<void> {
    const modal = await this.modalController.create({
      component: AchievementFormPage,
      componentProps: { achid: id },
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      await this.cargarDatos();
    }
  }

  async confirmarEliminar(id: number, name: string): Promise<void> {
    const alerta = await this.alertController.create({
      header: 'Eliminar logro',
      message: `¿Estás seguro de eliminar el logro "${name}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            void this.eliminarAchievement(id);
          }
        }
      ]
    });

    await alerta.present();
  }

  async eliminarAchievement(id: number): Promise<void> {
    try {
      await firstValueFrom(this.achievementService.eliminar(id));

      const alerta = await this.alertController.create({
        header: 'Logro eliminado',
        message: 'El logro fue eliminado correctamente.',
        buttons: ['Aceptar']
      });

      await alerta.present();
      await alerta.onDidDismiss();

      await this.cargarDatos();
    } catch (error) {
      console.error('Error al eliminar logro:', error);

      const alerta = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible eliminar el logro. Verifica si está desbloqueado por algún usuario.',
        buttons: ['Aceptar']
      });

      await alerta.present();
    }
  }
}
