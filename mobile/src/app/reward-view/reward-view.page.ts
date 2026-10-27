import { firstValueFrom } from 'rxjs';
import { RewardService } from '../services/reward';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';

interface RewardDetail {
  rewid: number;
  item_name: string;
  item_type: 'frame' | 'theme' | 'badge';
  cost_xp: number;
  rank_ranid: number;
  ranidfk?: number | null;
}

@Component({
  selector: 'app-reward-view',
  templateUrl: './reward-view.page.html',
  styleUrls: ['./reward-view.page.scss'],
  standalone: false
})
export class RewardViewPage implements OnInit {
  reward: RewardDetail | null = null;
  errorMessage: string = '';

  constructor(private route: ActivatedRoute,
    private loading: LoadingController, private rewardService: RewardService) {}

  ngOnInit(): void {
    this.loadReward();
  }

  async loadReward(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    this.reward = null;
    this.errorMessage = '';

    if (!id) {
      this.errorMessage = 'No se recibió el identificador de la recompensa.';
      return;
    }

    const loader = await this.loading.create({
      message: 'Cargando recompensa...',
      spinner: 'bubbles',
    });
    await loader.present();

    try {
      this.reward = await firstValueFrom(this.rewardService.detalle(id));
    } catch (error) {
      console.error('Error al cargar la recompensa:', error);
      this.errorMessage = 'No fue posible cargar la recompensa. Verifica la conexión y el ID.';
    } finally {
      await loader.dismiss();
    }
  }
}
