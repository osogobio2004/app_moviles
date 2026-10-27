import { firstValueFrom } from 'rxjs';
import { AchievementService } from '../services/achievement';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';

interface AchievementDetail {
  achid: number;
  name: string;
  criteria: any;
  xp_bonus: number;
}

@Component({
  selector: 'app-achievement-view',
  templateUrl: './achievement-view.page.html',
  styleUrls: ['./achievement-view.page.scss'],
  standalone: false
})
export class AchievementViewPage implements OnInit {
  achievement: AchievementDetail | null = null;
  errorMessage: string = '';

  constructor(private route: ActivatedRoute,
    private loading: LoadingController, private achievementService: AchievementService) {}

  ngOnInit(): void {
    this.loadAchievement();
  }

  getCriteriaString(criteria: any): string {
    if (!criteria) return '';
    return typeof criteria === 'object' ? JSON.stringify(criteria, null, 2) : String(criteria);
  }

  async loadAchievement(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    this.achievement = null;
    this.errorMessage = '';

    if (!id) {
      this.errorMessage = 'No se recibió el identificador del logro.';
      return;
    }

    const loader = await this.loading.create({
      message: 'Cargando logro...',
      spinner: 'bubbles',
    });
    await loader.present();

    try {
      this.achievement = await firstValueFrom(this.achievementService.detalle(id));
    } catch (error) {
      console.error('Error al cargar el logro:', error);
      this.errorMessage = 'No fue posible cargar el logro. Verifica la conexión y el ID.';
    } finally {
      await loader.dismiss();
    }
  }
}
