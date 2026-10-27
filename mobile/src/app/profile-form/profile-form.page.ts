import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { ProfileService } from '../services/profile';
import { ImagenesService } from '../services/imagenes';

interface ProfileSave {
  nickname: string;
  birthdate: string;
  avatar: string | null;
  couidfk: number;
}

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.page.html',
  styleUrls: ['./profile-form.page.scss'],
  standalone: false
})
export class ProfileFormPage implements OnInit, OnDestroy {
  @Input() proid?: number;

  profileForm!: FormGroup;
  loading: boolean = false;
  saving: boolean = false;

  archivoAvatar: File | null = null;
  avatarId: string | null = null;
  avatarUrl: string = '';
  mensajeAvatar: string = '';

  validationMessages: Record<string, Record<string, string>> = {
    nickname: {
      required: 'El apodo/nickname es obligatorio.',
      maxlength: 'El apodo no puede exceder 50 caracteres.'
    },
    birthdate: {
      required: 'La fecha de nacimiento es obligatoria.'
    },
    couidfk: {
      required: 'El ID de pareja es obligatorio.',
      min: 'El ID de pareja debe ser mayor a 0.'
    }
  };

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController,
    private profileService: ProfileService,
    private imagenesService: ImagenesService
  ) {}

  get isEdit(): boolean {
    return this.proid !== undefined;
  }

  async ngOnInit(): Promise<void> {
    this.createForm();
    if (this.isEdit) {
      await this.loadProfile();
    }
  }

  private createForm(): void {
    const today = new Date().toISOString().substring(0, 10);
    this.profileForm = this.formBuilder.group({
      nickname: ['', [Validators.required, Validators.maxLength(50)]],
      birthdate: [today, [Validators.required]],
      avatar: [''],
      couidfk: [1, [Validators.required, Validators.min(1)]]
    });
  }

  getError(controlName: string): string {
    const control = this.profileForm.get(controlName);
    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return '';
    }
    const errorType = Object.keys(control.errors)[0];
    return this.validationMessages[controlName]?.[errorType] ?? 'Valor inválido.';
  }

  private async loadProfile(): Promise<void> {
    if (this.proid === undefined) return;

    this.loading = true;
    try {
      const profile = await firstValueFrom(this.profileService.detalle(this.proid));

      let bDate = profile.birthdate;
      if (bDate && bDate.length > 10) {
        bDate = bDate.substring(0, 10);
      }

      this.profileForm.patchValue({
        nickname: profile.nickname || '',
        birthdate: bDate || '',
        avatar: profile.avatar || '',
        couidfk: Number(profile.couidfk || 1)
      });

      this.avatarId = profile.avatar ?? null;
      if (this.avatarId) {
        try {
          this.mostrarAvatar(await this.imagenesService.obtener(this.avatarId));
        } catch {
          if (this.avatarId.startsWith('http://') || this.avatarId.startsWith('https://')) {
            this.avatarUrl = this.avatarId;
          } else {
            this.mensajeAvatar = 'No fue posible cargar el avatar actual.';
          }
        }
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible cargar la información del perfil.',
        buttons: ['Aceptar']
      });
      await alert.present();
    } finally {
      this.loading = false;
    }
  }

  onAvatarSeleccionada(event: Event): void {
    this.archivoAvatar = (event.target as HTMLInputElement).files?.[0] ?? null;
    if (this.archivoAvatar) {
      this.mensajeAvatar = '';
      this.mostrarAvatar(this.archivoAvatar);
    }
  }

  private mostrarAvatar(archivo: Blob): void {
    if (this.avatarUrl && this.avatarUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.avatarUrl);
    }
    this.avatarUrl = URL.createObjectURL(archivo);
  }

  async closeModal(): Promise<void> {
    await this.modalController.dismiss({ saved: false });
  }

  async saveProfile(): Promise<void> {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.mensajeAvatar = '';
    const values = this.profileForm.value;

    try {
      if (this.archivoAvatar) {
        this.avatarId = await this.imagenesService.subir(this.archivoAvatar);
        this.archivoAvatar = null;
      }

      let bDate = values.birthdate;
      if (bDate && bDate.length > 10) {
        bDate = bDate.substring(0, 10);
      }

      const avatarFinal = this.avatarId ?? (values.avatar?.trim() || null);

      const payload: ProfileSave = {
        nickname: values.nickname.trim(),
        birthdate: bDate,
        avatar: avatarFinal,
        couidfk: Number(values.couidfk)
      };

      if (this.isEdit && this.proid !== undefined) {
        await firstValueFrom(this.profileService.actualizar(this.proid, payload));
      } else {
        await firstValueFrom(this.profileService.crear(payload));
      }

      const alert = await this.alertController.create({
        header: this.isEdit ? 'Perfil actualizado' : 'Perfil creado',
        message: this.isEdit
          ? 'El perfil y el avatar fueron actualizados correctamente.'
          : 'El perfil fue registrado exitosamente.',
        buttons: ['Aceptar']
      });
      await alert.present();
      await alert.onDidDismiss();

      await this.modalController.dismiss({ saved: true });
    } catch (error) {
      console.error('Error al guardar perfil:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible guardar el perfil. Verifica que el ID de pareja exista.',
        buttons: ['Aceptar']
      });
      await alert.present();
    } finally {
      this.saving = false;
    }
  }

  ngOnDestroy(): void {
    if (this.avatarUrl && this.avatarUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.avatarUrl);
    }
  }
}
