import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { ImagesService } from '../services/images';
import { ImagenesService } from '../services/imagenes';

interface ImageSave {
  url: string;
  date?: string | null;
  memidfk: number;
}

@Component({
  selector: 'app-images-form',
  templateUrl: './images-form.page.html',
  styleUrls: ['./images-form.page.scss'],
  standalone: false
})
export class ImagesFormPage implements OnInit, OnDestroy {
  @Input() imaid?: number;

  imagesForm!: FormGroup;
  loading: boolean = false;
  saving: boolean = false;

  archivoImagen: File | null = null;
  imagenId: string | null = null;
  imagenUrl: string = '';
  mensajeImagen: string = '';

  validationMessages: Record<string, Record<string, string>> = {
    memidfk: {
      required: 'El ID de recuerdo es obligatorio.',
      min: 'El ID de recuerdo debe ser mayor a 0.'
    }
  };

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController,
    private imagesService: ImagesService,
    private imagenesService: ImagenesService
  ) {}

  get isEdit(): boolean {
    return this.imaid !== undefined;
  }

  async ngOnInit(): Promise<void> {
    this.createForm();
    if (this.isEdit) {
      await this.loadImage();
    }
  }

  private createForm(): void {
    const today = new Date().toISOString().substring(0, 10);
    this.imagesForm = this.formBuilder.group({
      url: [''],
      date: [today],
      memidfk: [1, [Validators.required, Validators.min(1)]]
    });
  }

  getError(controlName: string): string {
    const control = this.imagesForm.get(controlName);
    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return '';
    }
    const errorType = Object.keys(control.errors)[0];
    return this.validationMessages[controlName]?.[errorType] ?? 'Valor inválido.';
  }

  private async loadImage(): Promise<void> {
    if (this.imaid === undefined) return;

    this.loading = true;
    try {
      const img = await firstValueFrom(this.imagesService.detalle(this.imaid));

      let dDate = img.date;
      if (dDate && dDate.length > 10) {
        dDate = dDate.substring(0, 10);
      }

      this.imagesForm.patchValue({
        url: img.url || '',
        date: dDate || '',
        memidfk: Number(img.memidfk || 1)
      });

      this.imagenId = img.url ?? null;
      if (this.imagenId) {
        try {
          this.mostrarImagen(await this.imagenesService.obtener(this.imagenId));
        } catch {
          if (this.imagenId.startsWith('http://') || this.imagenId.startsWith('https://')) {
            this.imagenUrl = this.imagenId;
          } else {
            this.mensajeImagen = 'No fue posible cargar la vista previa de la imagen actual.';
          }
        }
      }
    } catch (error) {
      console.error('Error al cargar imagen:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible cargar la información de la imagen.',
        buttons: ['Aceptar']
      });
      await alert.present();
    } finally {
      this.loading = false;
    }
  }

  onImagenSeleccionada(event: Event): void {
    this.archivoImagen = (event.target as HTMLInputElement).files?.[0] ?? null;
    if (this.archivoImagen) {
      this.mensajeImagen = '';
      this.mostrarImagen(this.archivoImagen);
    }
  }

  private mostrarImagen(archivo: Blob): void {
    if (this.imagenUrl && this.imagenUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.imagenUrl);
    }
    this.imagenUrl = URL.createObjectURL(archivo);
  }

  async closeModal(): Promise<void> {
    await this.modalController.dismiss({ saved: false });
  }

  async saveImage(): Promise<void> {
    if (this.imagesForm.invalid) {
      this.imagesForm.markAllAsTouched();
      return;
    }

    const values = this.imagesForm.value;
    const urlManual = values.url?.trim() ?? '';

    if (!this.archivoImagen && !this.imagenId && !urlManual) {
      this.mensajeImagen = 'Por favor selecciona un archivo de imagen o ingresa una URL.';
      return;
    }

    this.saving = true;
    this.mensajeImagen = '';

    try {
      if (this.archivoImagen) {
        this.imagenId = await this.imagenesService.subir(this.archivoImagen);
        this.archivoImagen = null;
      }

      let dDate = values.date;
      if (dDate && dDate.length > 10) {
        dDate = dDate.substring(0, 10);
      }

      const payload: ImageSave = {
        url: this.imagenId ?? urlManual,
        date: dDate || null,
        memidfk: Number(values.memidfk)
      };

      if (this.isEdit && this.imaid !== undefined) {
        await firstValueFrom(this.imagesService.actualizar(this.imaid, payload));
      } else {
        await firstValueFrom(this.imagesService.crear(payload));
      }

      const alert = await this.alertController.create({
        header: this.isEdit ? 'Imagen actualizada' : 'Imagen registrada',
        message: this.isEdit
          ? 'La imagen y el archivo fueron actualizados correctamente.'
          : 'La imagen fue guardada exitosamente.',
        buttons: ['Aceptar']
      });
      await alert.present();
      await alert.onDidDismiss();

      await this.modalController.dismiss({ saved: true });
    } catch (error) {
      console.error('Error al guardar imagen:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible guardar la imagen. Revisa la conexión y los permisos de Directus.',
        buttons: ['Aceptar']
      });
      await alert.present();
    } finally {
      this.saving = false;
    }
  }

  ngOnDestroy(): void {
    if (this.imagenUrl && this.imagenUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.imagenUrl);
    }
  }
}
