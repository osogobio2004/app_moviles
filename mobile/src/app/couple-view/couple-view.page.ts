import { firstValueFrom } from 'rxjs';
import { CoupleService } from '../services/couple';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';

interface CoupleDetail {
  couid: number;
  start_date: string;
  total_xp: number;
  last_interaction: string;
}

@Component({
  selector: 'app-couple-view',
  templateUrl: './couple-view.page.html',
  styleUrls: ['./couple-view.page.scss'],
  standalone: false
})
export class CoupleViewPage implements OnInit {
  couple: CoupleDetail | null = null;
  errorMessage: string = '';

  constructor(private route: ActivatedRoute,
    private loading: LoadingController, private coupleService: CoupleService) {}

  ngOnInit(): void {
    this.loadCouple();
  }

  async loadCouple(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    this.couple = null;
    this.errorMessage = '';

    if (!id) {
      this.errorMessage = 'No se recibió el identificador de la pareja.';
      return;
    }

    const loader = await this.loading.create({
      message: 'Cargando pareja...',
      spinner: 'bubbles',
    });
    await loader.present();

    try {
      this.couple = await firstValueFrom(this.coupleService.detalle(id));
    } catch (error) {
      console.error('Error al cargar la pareja:', error);
      this.errorMessage = 'No fue posible cargar la pareja. Verifica la conexión y el ID.';
    } finally {
      await loader.dismiss();
    }
  }
}
