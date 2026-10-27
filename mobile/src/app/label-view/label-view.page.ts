import { firstValueFrom } from 'rxjs';
import { LabelService } from '../services/label';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';

interface LabelDetail {
  labid: number;
  assigment_at: string;
  memidfk: number;
  tagidfk: number;
}

@Component({
  selector: 'app-label-view',
  templateUrl: './label-view.page.html',
  styleUrls: ['./label-view.page.scss'],
  standalone: false
})
export class LabelViewPage implements OnInit {
  label: LabelDetail | null = null;
  errorMessage: string = '';

  constructor(private route: ActivatedRoute,
    private loading: LoadingController, private labelService: LabelService) {}

  ngOnInit(): void {
    this.loadLabel();
  }

  async loadLabel(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    this.label = null;
    this.errorMessage = '';

    if (!id) {
      this.errorMessage = 'No se recibió el identificador de la asignación.';
      return;
    }

    const loader = await this.loading.create({
      message: 'Cargando asignación...',
      spinner: 'bubbles',
    });
    await loader.present();

    try {
      this.label = await firstValueFrom(this.labelService.detalle(id));
    } catch (error) {
      console.error('Error al cargar la asignación:', error);
      this.errorMessage = 'No fue posible cargar la información. Verifica la conexión y el ID.';
    } finally {
      await loader.dismiss();
    }
  }
}
