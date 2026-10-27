import { firstValueFrom } from 'rxjs';
import { CoupleService } from '../services/couple';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';

interface CoupleSave {
  start_date: string;
  total_xp: number;
  last_interaction: string;
}

interface CoupleDetail {
  couid: number;
  start_date: string;
  total_xp: number;
  last_interaction: string;
}

@Component({
  selector: 'app-couple-form',
  templateUrl: './couple-form.page.html',
  styleUrls: ['./couple-form.page.scss'],
  standalone: false
})
export class CoupleFormPage implements OnInit {
  @Input() couid?: number;

  coupleForm!: FormGroup;
  loading: boolean = false;
  saving: boolean = false;

  validationMessages: Record<string, Record<string, string>> = {
    start_date: {
      required: 'La fecha de inicio de la relación es obligatoria.'
    },
    total_xp: {
      required: 'El total de XP es obligatorio.',
      min: 'El total de XP debe ser 0 o mayor.'
    },
    last_interaction: {
      required: 'La fecha de última interacción es obligatoria.'
    }
  };

  constructor(private formBuilder: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController, private coupleService: CoupleService) {}

  get isEdit(): boolean {
    return this.couid !== undefined;
  }

  async ngOnInit(): Promise<void> {
    this.createForm();
    if (this.isEdit) {
      await this.loadCouple();
    }
  }

  private createForm(): void {
    const today = new Date().toISOString().substring(0, 10);
    const nowIso = new Date().toISOString().substring(0, 16);
    this.coupleForm = this.formBuilder.group({
      start_date: [today, [Validators.required]],
      total_xp: [0, [Validators.required, Validators.min(0)]],
      last_interaction: [nowIso, [Validators.required]]
    });
  }

  getError(controlName: string): string {
    const control = this.coupleForm.get(controlName);
    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return '';
    }
    const errorType = Object.keys(control.errors)[0];
    return this.validationMessages[controlName]?.[errorType] ?? 'Valor inválido.';
  }

  private async loadCouple(): Promise<void> {
    if (this.couid === undefined) return;

    this.loading = true;
    try {
      const couple = await firstValueFrom(this.coupleService.detalle(this.couid));

      let sDate = couple.start_date;
      if (sDate && sDate.length > 10) {
        sDate = sDate.substring(0, 10);
      }

      let lInteraction = couple.last_interaction;
      if (lInteraction && lInteraction.length > 16) {
        lInteraction = lInteraction.substring(0, 16);
      }

      this.coupleForm.patchValue({
        start_date: sDate || '',
        total_xp: Number(couple.total_xp || 0),
        last_interaction: lInteraction || ''
      });
    } catch (error) {
      console.error('Error al cargar pareja:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible cargar la información de la pareja.',
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

  async saveCouple(): Promise<void> {
    if (this.coupleForm.invalid) {
      this.coupleForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const values = this.coupleForm.value;

    let sDate = values.start_date;
    if (sDate && sDate.length > 10) {
      sDate = sDate.substring(0, 10);
    }

    let lDate = values.last_interaction;
    if (lDate && lDate.length === 16) {
      lDate = `${lDate}:00`;
    }

    const payload: CoupleSave = {
      start_date: sDate,
      total_xp: Number(values.total_xp),
      last_interaction: lDate
    };

    try {
      if (this.isEdit && this.couid !== undefined) {
        await firstValueFrom(this.coupleService.actualizar(this.couid, payload));
      } else {
        await firstValueFrom(this.coupleService.crear(payload));
      }

      const alert = await this.alertController.create({
        header: this.isEdit ? 'Pareja actualizada' : 'Pareja creada',
        message: this.isEdit
          ? 'La pareja fue actualizada correctamente.'
          : 'La pareja fue registrada exitosamente.',
        buttons: ['Aceptar']
      });
      await alert.present();
      await alert.onDidDismiss();

      await this.modalController.dismiss({ saved: true });
    } catch (error) {
      console.error('Error al guardar pareja:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible guardar la pareja. Verifica los campos introducidos.',
        buttons: ['Aceptar']
      });
      await alert.present();
    } finally {
      this.saving = false;
    }
  }
}
