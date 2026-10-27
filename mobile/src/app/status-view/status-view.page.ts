import { firstValueFrom } from 'rxjs';
import { StatusService } from '../services/status';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';

interface StatusDetail {
  staid: number;
  description: string;
}

@Component({
  selector: 'app-status-view',
  templateUrl: './status-view.page.html',
  styleUrls: ['./status-view.page.scss'],
  standalone: false
})
export class StatusViewPage implements OnInit {
  status: StatusDetail | null = null;
  errorMessage: string = '';

  constructor(private route: ActivatedRoute,
    private loading: LoadingController, private statusService: StatusService) {}

  ngOnInit(): void {
    this.loadStatus();
  }

  async loadStatus(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    this.status = null;
    this.errorMessage = '';

    if (!id) {
      this.errorMessage = 'No se recibió el identificador del estado.';
      return;
    }

    const loader = await this.loading.create({
      message: 'Cargando estado...',
      spinner: 'bubbles',
    });
    await loader.present();

    try {
      this.status = await firstValueFrom(this.statusService.detalle(id));
    } catch (error) {
      console.error('Error al cargar el estado:', error);
      this.errorMessage = 'No fue posible cargar el estado. Verifica la conexión y el ID.';
    } finally {
      await loader.dismiss();
    }
  }
}
