import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { Mission, MissionService } from '../services/mission';

@Component({
  selector: 'app-mission-view',
  templateUrl: './mission-view.page.html',
  styleUrls: ['./mission-view.page.scss'],
  standalone: false
})
export class MissionViewPage implements OnInit {
  mission: Mission | null = null;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private loading: LoadingController,
    private missionService: MissionService
  ) {}

  getCategoryName(cat: any): string {
    if (!cat) return '';
    return typeof cat === 'object' && cat.name ? cat.name : String(cat);
  }

  getStatusDescription(sta: any): string {
    if (!sta) return '';
    return typeof sta === 'object' && sta.description ? sta.description : String(sta);
  }

  ngOnInit(): void {
    this.loadMission();
  }

  async loadMission(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    this.mission = null;
    this.errorMessage = '';

    if (!id) {
      this.errorMessage = 'No mission ID received.';
      return;
    }

    const loading = await this.loading.create({
      message: 'Loading mission...',
      spinner: 'bubbles',
    });
    await loading.present();

    try {
      this.mission = await firstValueFrom(this.missionService.detalle(id));
    } catch (error) {
      console.error('Error loading mission:', error);
      this.errorMessage = 'Could not load mission data. Check the connection and ID.';
    } finally {
      await loading.dismiss();
    }
  }
}
