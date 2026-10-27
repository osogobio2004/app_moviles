import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { ProfileService } from '../services/profile';
import { ImagenesService } from '../services/imagenes';
import { environment } from '../../environments/environment';

interface ProfileDetail {
  proid: number;
  nickname: string;
  birthdate: string;
  avatar: string | null;
  couidfk: number;
}

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.page.html',
  styleUrls: ['./profile-view.page.scss'],
  standalone: false
})
export class ProfileViewPage implements OnInit, OnDestroy {
  profile: ProfileDetail | null = null;
  errorMessage: string = '';
  avatarBlobUrl: string = '';
  mensajeAvatar: string = '';

  constructor(
    private route: ActivatedRoute,
    private loading: LoadingController,
    private profileService: ProfileService,
    private imagenesService: ImagenesService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  ionViewWillEnter(): void {
    this.loadProfile();
  }

  async loadProfile(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    if (this.avatarBlobUrl && this.avatarBlobUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.avatarBlobUrl);
    }
    this.avatarBlobUrl = '';
    this.mensajeAvatar = '';
    this.profile = null;
    this.errorMessage = '';

    if (!id) {
      this.errorMessage = 'No se recibió el identificador del perfil.';
      return;
    }

    const loader = await this.loading.create({
      message: 'Cargando perfil...',
      spinner: 'bubbles',
    });
    await loader.present();

    try {
      this.profile = await firstValueFrom(this.profileService.detalle(id));
      if (this.profile?.avatar) {
        await this.cargarAvatarBlob(this.profile.avatar);
      }
    } catch (error) {
      console.error('Error al cargar el perfil:', error);
      this.errorMessage = 'No fue posible cargar el perfil. Verifica la conexión y el ID.';
    } finally {
      await loader.dismiss();
    }
  }

  private async cargarAvatarBlob(avatarOrId: string): Promise<void> {
    if (!avatarOrId) return;
    if (avatarOrId.startsWith('http://') || avatarOrId.startsWith('https://')) {
      this.avatarBlobUrl = avatarOrId;
      return;
    }
    try {
      const blob = await this.imagenesService.obtener(avatarOrId);
      if (this.avatarBlobUrl && this.avatarBlobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(this.avatarBlobUrl);
      }
      this.avatarBlobUrl = URL.createObjectURL(blob);
    } catch {
      this.mensajeAvatar = 'No fue posible cargar la imagen de avatar desde Directus.';
    }
  }

  abrirPagina(): void {
    if (!this.profile) return;
    const url = `${environment.apiUrl}/items/profile/${this.profile.proid}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  ngOnDestroy(): void {
    if (this.avatarBlobUrl && this.avatarBlobUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.avatarBlobUrl);
    }
  }
}
