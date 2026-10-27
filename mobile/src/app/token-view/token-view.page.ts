import { firstValueFrom } from 'rxjs';
import { TokenService } from '../services/token';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';

interface TokenDetail {
  tokid: number;
  code: string;
  created_at: string;
  expires_at: string;
  is_used: number | boolean;
  couidfk: number;
}

@Component({
  selector: 'app-token-view',
  templateUrl: './token-view.page.html',
  styleUrls: ['./token-view.page.scss'],
  standalone: false
})
export class TokenViewPage implements OnInit {
  token: TokenDetail | null = null;
  errorMessage: string = '';

  constructor(private route: ActivatedRoute,
    private loading: LoadingController, private tokenService: TokenService) {}

  ngOnInit(): void {
    this.loadToken();
  }

  async loadToken(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    this.token = null;
    this.errorMessage = '';

    if (!id) {
      this.errorMessage = 'No se recibió el identificador del token.';
      return;
    }

    const loader = await this.loading.create({
      message: 'Cargando token...',
      spinner: 'bubbles',
    });
    await loader.present();

    try {
      this.token = await firstValueFrom(this.tokenService.detalle(id));
    } catch (error) {
      console.error('Error al cargar token:', error);
      this.errorMessage = 'No fue posible cargar el token. Verifica la conexión y el ID.';
    } finally {
      await loader.dismiss();
    }
  }
}
