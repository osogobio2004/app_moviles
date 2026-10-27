import { firstValueFrom } from 'rxjs';
import { UnlockService } from '../services/unlock';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';

interface UnlockDetail {
  unlid: number;
  unlocked_at: string;
  couidfk: number;
  achidfk: number;
}

@Component({
  selector: 'app-unlock-view',
  templateUrl: './unlock-view.page.html',
  styleUrls: ['./unlock-view.page.scss'],
  standalone: false
})
export class UnlockViewPage implements OnInit {
  unlock: UnlockDetail | null = null;
  errorMessage: string = '';

  constructor(private route: ActivatedRoute,
    private loading: LoadingController, private unlockService: UnlockService) {}

  ngOnInit(): void {
    this.loadUnlock();
  }

  async loadUnlock(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    this.unlock = null;
    this.errorMessage = '';

    if (!id) {
      this.errorMessage = 'No se recibió el identificador del desbloqueo.';
      return;
    }

    const loader = await this.loading.create({
      message: 'Cargando información...',
      spinner: 'bubbles',
    });
    await loader.present();

    try {
      this.unlock = await firstValueFrom(this.unlockService.detalle(id));
    } catch (error) {
      console.error('Error al cargar desbloqueo:', error);
      this.errorMessage = 'No fue posible cargar el desbloqueo. Verifica la conexión y el ID.';
    } finally {
      await loader.dismiss();
    }
  }
}
