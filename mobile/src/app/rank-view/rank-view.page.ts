import { firstValueFrom } from 'rxjs';
import { RankService } from '../services/rank';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';

interface RankDetail {
  ranid: number;
  title: string;
  min_xp: number;
  badge_icon?: string | null;
}

@Component({
  selector: 'app-rank-view',
  templateUrl: './rank-view.page.html',
  styleUrls: ['./rank-view.page.scss'],
  standalone: false
})
export class RankViewPage implements OnInit {
  rank: RankDetail | null = null;
  errorMessage: string = '';

  constructor(private route: ActivatedRoute,
    private loading: LoadingController, private rankService: RankService) {}

  ngOnInit(): void {
    this.loadRank();
  }

  getRankTitle(detail: any): string {
    return detail?.title || detail?.tittle || 'Sin título';
  }

  async loadRank(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    this.rank = null;
    this.errorMessage = '';

    if (!id) {
      this.errorMessage = 'No se recibió el identificador del rango.';
      return;
    }

    const loader = await this.loading.create({
      message: 'Cargando rango...',
      spinner: 'bubbles',
    });
    await loader.present();

    try {
      this.rank = await firstValueFrom(this.rankService.detalle(id));
    } catch (error) {
      console.error('Error al cargar el rango:', error);
      this.errorMessage = 'No fue posible cargar el rango. Verifica la conexión y el ID.';
    } finally {
      await loader.dismiss();
    }
  }
}
