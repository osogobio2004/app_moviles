import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-profile-imagen',
  templateUrl: './profile-imagen.page.html',
  styleUrls: ['./profile-imagen.page.scss'],
  standalone: false
})
export class ProfileImagenPage implements OnInit, OnDestroy {
  idProfile = 0;
  archivo: File | null = null;
  imagenUrl = '';
  mensaje = '';
  enviando = false;

  constructor(private route: ActivatedRoute, private auth: AuthService) {}

  async ngOnInit(): Promise<void> {
    this.idProfile = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(this.idProfile) || this.idProfile < 1) {
      this.mensaje = 'Selecciona un perfil válido.';
      return;
    }
    try {
      const response = await this.auth.cliente.get<{ data: { avatar: string | null } }>(
        '/items/profile/' + this.idProfile,
        { params: { fields: 'avatar' } }
      );
      if (response.data.data.avatar) {
        await this.mostrar(response.data.data.avatar);
      }
    } catch {
      this.mensaje = 'No fue posible cargar el avatar del perfil.';
    }
  }

  onFileSelected(event: Event): void {
    this.archivo = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.mensaje = '';
  }

  private async mostrar(id: string): Promise<void> {
    try {
      const response = await this.auth.cliente.get<Blob>('/assets/' + id, { responseType: 'blob' });
      if (this.imagenUrl && this.imagenUrl.startsWith('blob:')) {
        URL.revokeObjectURL(this.imagenUrl);
      }
      this.imagenUrl = URL.createObjectURL(response.data);
    } catch {
      if (id && (id.startsWith('http://') || id.startsWith('https://'))) {
        this.imagenUrl = id;
      }
    }
  }

  async subir(): Promise<void> {
    if (!this.archivo || this.idProfile < 1) return;
    this.enviando = true;
    this.mensaje = '';
    try {
      const datos = new FormData();
      datos.append('file', this.archivo);
      const response = await this.auth.cliente.post<{ data: { id: string } }>('/files', datos);
      const fileId = response.data.data.id;
      await this.auth.cliente.patch('/items/profile/' + this.idProfile, { avatar: fileId });
      await this.mostrar(fileId);
      this.mensaje = 'Avatar guardado correctamente en el perfil.';
    } catch {
      this.mensaje = 'No fue posible guardar el avatar. Revisa el archivo y los permisos configurados.';
    } finally {
      this.enviando = false;
    }
  }

  ngOnDestroy(): void {
    if (this.imagenUrl && this.imagenUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.imagenUrl);
    }
  }
}
