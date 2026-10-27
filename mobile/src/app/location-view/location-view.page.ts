import { firstValueFrom } from 'rxjs';
import { LocationService } from '../services/location';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';

interface LocationDetail {
  locid: number;
  place_name: string;
  latitude?: number | null;
  longitude?: number | null;
  jouidfk: number;
}

@Component({
  selector: 'app-location-view',
  templateUrl: './location-view.page.html',
  styleUrls: ['./location-view.page.scss'],
  standalone: false
})
export class LocationViewPage implements OnInit {
  location: LocationDetail | null = null;
  errorMessage: string = '';

  constructor(private route: ActivatedRoute,
    private loading: LoadingController, private locationService: LocationService) {}

  ngOnInit(): void {
    this.loadLocation();
  }

  async loadLocation(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    this.location = null;
    this.errorMessage = '';

    if (!id) {
      this.errorMessage = 'No se recibió el identificador del lugar.';
      return;
    }

    const loader = await this.loading.create({
      message: 'Cargando lugar...',
      spinner: 'bubbles',
    });
    await loader.present();

    try {
      this.location = await firstValueFrom(this.locationService.detalle(id));
    } catch (error) {
      console.error('Error al cargar la ubicación:', error);
      this.errorMessage = 'No fue posible cargar el lugar. Verifica la conexión y el ID.';
    } finally {
      await loader.dismiss();
    }
  }
}
