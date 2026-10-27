import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-images-imagen',
  templateUrl: './images-imagen.page.html',
  styleUrls: ['./images-imagen.page.scss'],
  standalone: false
})
export class ImagesImagenPage implements OnInit, OnDestroy {
  idImagen = 0;
  archivo: File | null = null;
  imagenUrl = '';
  mensaje = '';
  enviando = false;

  constructor(private route: ActivatedRoute, private auth: AuthService) {}

  async ngOnInit(): Promise<void> {
    this.idImagen = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(this.idImagen) || this.idImagen < 1) {
      this.mensaje = 'Selecciona una imagen válida.';
      return;
    }
    try {
      const response = await this.auth.cliente.get<{ data: { url: string | null } }>(
        '/items/images/' + this.idImagen,
        { params: { fields: 'url' } }
      );
      if (response.data.data.url) {
        await this.mostrar(response.data.data.url);
      }
    } catch {
      this.mensaje = 'No fue posible cargar la imagen del recuerdo.';
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
    if (!this.archivo || this.idImagen < 1) return;
    this.enviando = true;
    this.mensaje = '';
    try {
      const datos = new FormData();
      datos.append('file', this.archivo);
      const response = await this.auth.cliente.post<{ data: { id: string } }>('/files', datos);
      const fileId = response.data.data.id;
      await this.auth.cliente.patch('/items/images/' + this.idImagen, { url: fileId });
      await this.mostrar(fileId);
      this.mensaje = 'Imagen guardada correctamente en el recuerdo.';
    } catch {
      this.mensaje = 'No fue posible guardar la imagen. Revisa el archivo y los permisos configurados.';
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
