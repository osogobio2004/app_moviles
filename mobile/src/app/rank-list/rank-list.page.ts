import { firstValueFrom } from 'rxjs';
import { RankService } from '../services/rank';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { RankFormPage } from '../rank-form/rank-form.page';

interface Rank {
  ranid: number;
  title: string;
  min_xp: number;
  badge_icon?: string | null;
}

interface ConteoDirectus {
  count: number | string;
}

interface ConteoDirectusResponse {
  data: ConteoDirectus[];
}

@Component({
  selector: 'app-rank-list',
  templateUrl: './rank-list.page.html',
  styleUrls: ['./rank-list.page.scss'],
  standalone: false,
})
export class RankListPage implements OnInit {
  ranks: Rank[] = [];

  busqueda: string = '';
  total: number = 0;
  paginaActual: number = 1;
  porPagina: number = 10;

  private parametrosBusqueda(): Record<string, string> {
    const texto = this.busqueda.trim();
    return texto ? {
      filter: JSON.stringify({
        title: { _icontains: texto }
      })
    } : {};
  }

  async handleInput(event: CustomEvent<{ value?: string | null }>): Promise<void> {
    this.busqueda = event.detail.value ?? '';
    this.paginaActual = 1;
    await this.cargarDatos();
  }

  constructor(private modalController: ModalController,
    private alertController: AlertController, private rankService: RankService) {}

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    this.cargarDatos();
  }

  getRankTitle(rank: any): string {
    return rank?.title || rank?.tittle || 'Sin título';
  }

  async cargarDatos(): Promise<void> {
    await Promise.all([this.cargarTotal(), this.loadRanks()]);
    this.ajustarPaginaActual();
  }

  async cargarTotal(): Promise<void> {
    try {
      this.total = await firstValueFrom(this.rankService.total(this.busqueda));
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
    await this.loadRanks();
  }

  async loadRanks(): Promise<void> {
    try {
      this.ranks = await firstValueFrom(
        this.rankService.listado(this.paginaActual, this.porPagina, this.busqueda)
      );
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.ranks = [];
    }
  }


  async newRank(): Promise<void> {
    const modal = await this.modalController.create({
      component: RankFormPage,
      breakpoints: [0, 0.5, 0.95],
      initialBreakpoint: 0.95
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      await this.cargarDatos();
    }
  }

  async editRank(id: number): Promise<void> {
    const modal = await this.modalController.create({
      component: RankFormPage,
      componentProps: { ranid: id },
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
      header: 'Eliminar rango',
      message: `¿Estás seguro de eliminar el rango "${title}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            void this.eliminarRank(id);
          }
        }
      ]
    });

    await alerta.present();
  }

  async eliminarRank(id: number): Promise<void> {
    try {
      await firstValueFrom(this.rankService.eliminar(id));

      const alerta = await this.alertController.create({
        header: 'Rango eliminado',
        message: 'El rango fue eliminado correctamente.',
        buttons: ['Aceptar']
      });

      await alerta.present();
      await alerta.onDidDismiss();

      await this.cargarDatos();
    } catch (error) {
      console.error('Error al eliminar rango:', error);

      const alerta = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible eliminar el rango. Verifica si existen recompensas asociadas.',
        buttons: ['Aceptar']
      });

      await alerta.present();
    }
  }
}
