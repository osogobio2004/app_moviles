import { firstValueFrom } from 'rxjs';
import { JourneyService } from '../services/journey';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';

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
  staidfk: Status | any;
  visited_at?: string | null;
}

@Component({
  selector: 'app-journey-view',
  templateUrl: './journey-view.page.html',
  styleUrls: ['./journey-view.page.scss'],
  standalone: false
})
export class JourneyViewPage implements OnInit {
  journey: Journey | null = null;
  errorMessage: string = '';

  constructor(private route: ActivatedRoute,
    private loading: LoadingController, private journeyService: JourneyService) {}

  getStatusDescription(sta: any): string {
    if (!sta) return 'Sin estado';
    return typeof sta === 'object' && sta.description ? sta.description : String(sta);
  }

  ngOnInit(): void {
    this.loadJourney();
  }

  async loadJourney(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    this.journey = null;
    this.errorMessage = '';

    if (!id) {
      this.errorMessage = 'No se recibió el identificador del viaje.';
      return;
    }

    const loader = await this.loading.create({
      message: 'Cargando viaje...',
      spinner: 'bubbles',
    });
    await loader.present();

    try {
      this.journey = await firstValueFrom(this.journeyService.detalle(id));
    } catch (error) {
      console.error('Error al cargar el viaje:', error);
      this.errorMessage = 'No fue posible cargar la información del viaje. Verifica la conexión y el ID.';
    } finally {
      await loader.dismiss();
    }
  }
}
