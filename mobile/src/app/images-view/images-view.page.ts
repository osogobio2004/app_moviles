import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { ImagesService } from '../services/images';
import { ImagenesService } from '../services/imagenes';
import { environment } from '../../environments/environment';

interface ImageDetail {
  imaid: number;
  url: string;
  date?: string | null;
  memidfk: number;
}

@Component({
  selector: 'app-images-view',
  templateUrl: './images-view.page.html',
  styleUrls: ['./images-view.page.scss'],
  standalone: false
})
export class ImagesViewPage implements OnInit, OnDestroy {
  image: ImageDetail | null = null;
  errorMessage: string = '';
  imagenBlobUrl: string = '';
  mensajeImagen: string = '';

  constructor(
    private route: ActivatedRoute,
    private loading: LoadingController,
    private imagesService: ImagesService,
    private imagenesService: ImagenesService
  ) {}

  ngOnInit(): void {
    this.loadImage();
  }

  ionViewWillEnter(): void {
    this.loadImage();
  }

  async loadImage(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    if (this.imagenBlobUrl && this.imagenBlobUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.imagenBlobUrl);
    }
    this.imagenBlobUrl = '';
    this.mensajeImagen = '';
    this.image = null;
    this.errorMessage = '';

    if (!id) {
      this.errorMessage = 'No se recibió el identificador de la imagen.';
      return;
    }

    const loader = await this.loading.create({
      message: 'Cargando imagen...',
      spinner: 'bubbles',
    });
    await loader.present();

    try {
      this.image = await firstValueFrom(this.imagesService.detalle(id));
      if (this.image?.url) {
        await this.cargarImagenBlob(this.image.url);
      }
    } catch (error) {
      console.error('Error al cargar imagen:', error);
      this.errorMessage = 'No fue posible cargar la imagen. Verifica la conexión y el ID.';
    } finally {
      await loader.dismiss();
    }
  }

  private async cargarImagenBlob(urlOrId: string): Promise<void> {
    if (!urlOrId) return;
    if (urlOrId.startsWith('http://') || urlOrId.startsWith('https://')) {
      this.imagenBlobUrl = urlOrId;
      return;
    }
    try {
      const blob = await this.imagenesService.obtener(urlOrId);
      if (this.imagenBlobUrl && this.imagenBlobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(this.imagenBlobUrl);
      }
      this.imagenBlobUrl = URL.createObjectURL(blob);
    } catch {
      this.mensajeImagen = 'No fue posible cargar el archivo de la imagen desde Directus.';
    }
  }

  abrirPagina(): void {
    if (!this.image) return;
    const url = `${environment.apiUrl}/items/images/${this.image.imaid}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  ngOnDestroy(): void {
    if (this.imagenBlobUrl && this.imagenBlobUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.imagenBlobUrl);
    }
  }
}
