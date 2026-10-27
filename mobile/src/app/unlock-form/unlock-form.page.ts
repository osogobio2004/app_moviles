import { firstValueFrom } from 'rxjs';
import { UnlockService } from '../services/unlock';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';

interface UnlockSave {
  unlocked_at: string;
  couidfk: number;
  achidfk: number;
}

interface UnlockDetail {
  unlid: number;
  unlocked_at: string;
  couidfk: number;
  achidfk: number;
}

@Component({
  selector: 'app-unlock-form',
  templateUrl: './unlock-form.page.html',
  styleUrls: ['./unlock-form.page.scss'],
  standalone: false
})
export class UnlockFormPage implements OnInit {
  @Input() unlid?: number;

  unlockForm!: FormGroup;
  loading: boolean = false;
  saving: boolean = false;

  validationMessages: Record<string, Record<string, string>> = {
    unlocked_at: {
      required: 'La fecha de desbloqueo es obligatoria.'
    },
    couidfk: {
      required: 'El ID de la pareja es obligatorio.',
      min: 'El ID debe ser mayor a 0.'
    },
    achidfk: {
      required: 'El ID del logro es obligatorio.',
      min: 'El ID debe ser mayor a 0.'
    }
  };

  constructor(private formBuilder: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController, private unlockService: UnlockService) {}

  get isEdit(): boolean {
    return this.unlid !== undefined;
  }

  async ngOnInit(): Promise<void> {
    this.createForm();
    if (this.isEdit) {
      await this.loadUnlock();
    }
  }

  private createForm(): void {
    const nowIso = new Date().toISOString().substring(0, 16);
    this.unlockForm = this.formBuilder.group({
      unlocked_at: [nowIso, [Validators.required]],
      couidfk: [1, [Validators.required, Validators.min(1)]],
      achidfk: [1, [Validators.required, Validators.min(1)]]
    });
  }

  getError(controlName: string): string {
    const control = this.unlockForm.get(controlName);
    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return '';
    }
    const errorType = Object.keys(control.errors)[0];
    return this.validationMessages[controlName]?.[errorType] ?? 'Valor inválido.';
  }

  private async loadUnlock(): Promise<void> {
    if (this.unlid === undefined) return;

    this.loading = true;
    try {
      const unlock = await firstValueFrom(this.unlockService.detalle(this.unlid));

      let uDate = unlock.unlocked_at;
      if (uDate && uDate.length > 16) {
        uDate = uDate.substring(0, 16);
      }

      this.unlockForm.patchValue({
        unlocked_at: uDate || '',
        couidfk: Number(unlock.couidfk || 1),
        achidfk: Number(unlock.achidfk || 1)
      });
    } catch (error) {
      console.error('Error al cargar desbloqueo:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible cargar la información del desbloqueo.',
        buttons: ['Aceptar']
      });
      await alert.present();
    } finally {
      this.loading = false;
    }
  }

  async closeModal(): Promise<void> {
    await this.modalController.dismiss({ saved: false });
  }

  async saveUnlock(): Promise<void> {
    if (this.unlockForm.invalid) {
      this.unlockForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const values = this.unlockForm.value;

    let uDate = values.unlocked_at;
    if (uDate && uDate.length === 16) {
      uDate = `${uDate}:00`;
    }

    const payload: UnlockSave = {
      unlocked_at: uDate,
      couidfk: Number(values.couidfk),
      achidfk: Number(values.achidfk)
    };

    try {
      if (this.isEdit && this.unlid !== undefined) {
        await firstValueFrom(this.unlockService.actualizar(this.unlid, payload));
      } else {
        await firstValueFrom(this.unlockService.crear(payload));
      }

      const alert = await this.alertController.create({
        header: this.isEdit ? 'Desbloqueo actualizado' : 'Desbloqueo creado',
        message: this.isEdit
          ? 'El registro de desbloqueo fue actualizado correctamente.'
          : 'El logro fue desbloqueado para la pareja exitosamente.',
        buttons: ['Aceptar']
      });
      await alert.present();
      await alert.onDidDismiss();

      await this.modalController.dismiss({ saved: true });
    } catch (error) {
      console.error('Error al guardar desbloqueo:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible guardar el desbloqueo. Verifica que el ID de pareja y logro existan.',
        buttons: ['Aceptar']
      });
      await alert.present();
    } finally {
      this.saving = false;
    }
  }
}
