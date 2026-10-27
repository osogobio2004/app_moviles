import { firstValueFrom } from 'rxjs';
import { RewardService } from '../services/reward';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { RewardFormPage } from '../reward-form/reward-form.page';

interface Reward {
  rewid: number;
  item_name: string;
  item_type: 'frame' | 'theme' | 'badge';
  cost_xp: number;
  rank_ranid: number;
  ranidfk?: number | null;
}

interface ConteoDirectus {
  count: number | string;
}

interface ConteoDirectusResponse {
  data: ConteoDirectus[];
}

@Component({
  selector: 'app-reward-list',
  templateUrl: './reward-list.page.html',
  styleUrls: ['./reward-list.page.scss'],
  standalone: false,
})
export class RewardListPage implements OnInit {
  rewards: Reward[] = [];

  busqueda: string = '';
  total: number = 0;
  paginaActual: number = 1;
  porPagina: number = 10;

  private parametrosBusqueda(): Record<string, string> {
    const texto = this.busqueda.trim();
    return texto ? {
      filter: JSON.stringify({
        _or: [
          { item_name: { _icontains: texto } },
          { item_type: { _contains: texto } }
        ]
      })
    } : {};
  }

  async handleInput(event: CustomEvent<{ value?: string | null }>): Promise<void> {
    this.busqueda = event.detail.value ?? '';
    this.paginaActual = 1;
    await this.cargarDatos();
  }

  constructor(private modalController: ModalController,
    private alertController: AlertController, private rewardService: RewardService) {}

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    this.cargarDatos();
  }

  async cargarDatos(): Promise<void> {
    await Promise.all([this.cargarTotal(), this.loadRewards()]);
    this.ajustarPaginaActual();
  }

  async cargarTotal(): Promise<void> {
    try {
      this.total = await firstValueFrom(this.rewardService.total(this.busqueda));
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
    await this.loadRewards();
  }

  async loadRewards(): Promise<void> {
    try {
      this.rewards = await firstValueFrom(
        this.rewardService.listado(this.paginaActual, this.porPagina, this.busqueda)
      );
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.rewards = [];
    }
  }


  async newReward(): Promise<void> {
    const modal = await this.modalController.create({
      component: RewardFormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      await this.cargarDatos();
    }
  }

  async editReward(id: number): Promise<void> {
    const modal = await this.modalController.create({
      component: RewardFormPage,
      componentProps: { rewid: id },
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
      header: 'Eliminar recompensa',
      message: `¿Estás seguro de eliminar la recompensa "${name}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            void this.eliminarReward(id);
          }
        }
      ]
    });

    await alerta.present();
  }

  async eliminarReward(id: number): Promise<void> {
    try {
      await firstValueFrom(this.rewardService.eliminar(id));

      const alerta = await this.alertController.create({
        header: 'Recompensa eliminada',
        message: 'La recompensa fue eliminada correctamente.',
        buttons: ['Aceptar']
      });

      await alerta.present();
      await alerta.onDidDismiss();

      await this.cargarDatos();
    } catch (error) {
      console.error('Error al eliminar recompensa:', error);

      const alerta = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible eliminar la recompensa. Verifica si está vinculada a un inventario.',
        buttons: ['Aceptar']
      });

      await alerta.present();
    }
  }
}
