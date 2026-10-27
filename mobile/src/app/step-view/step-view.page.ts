import { firstValueFrom } from 'rxjs';
import { StepService } from '../services/step';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';

interface StepDetail {
  steid: number;
  instruction: string;
  order_num: number;
  is_done: number | boolean;
  misidfk: number;
}

@Component({
  selector: 'app-step-view',
  templateUrl: './step-view.page.html',
  styleUrls: ['./step-view.page.scss'],
  standalone: false
})
export class StepViewPage implements OnInit {
  step: StepDetail | null = null;
  errorMessage: string = '';

  constructor(private route: ActivatedRoute,
    private loading: LoadingController, private stepService: StepService) {}

  ngOnInit(): void {
    this.loadStep();
  }

  async loadStep(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    this.step = null;
    this.errorMessage = '';

    if (!id) {
      this.errorMessage = 'No se recibió el identificador del paso.';
      return;
    }

    const loader = await this.loading.create({
      message: 'Cargando paso...',
      spinner: 'bubbles',
    });
    await loader.present();

    try {
      this.step = await firstValueFrom(this.stepService.detalle(id));
    } catch (error) {
      console.error('Error al cargar el paso:', error);
      this.errorMessage = 'No fue posible cargar el paso. Verifica la conexión y el ID.';
    } finally {
      await loader.dismiss();
    }
  }
}
