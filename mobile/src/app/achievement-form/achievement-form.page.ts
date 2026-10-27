import { firstValueFrom } from 'rxjs';
import { AchievementService } from '../services/achievement';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';

interface AchievementSave {
  name: string;
  criteria: any;
  xp_bonus: number;
}

interface AchievementDetail {
  achid: number;
  name: string;
  criteria: any;
  xp_bonus: number;
}

@Component({
  selector: 'app-achievement-form',
  templateUrl: './achievement-form.page.html',
  styleUrls: ['./achievement-form.page.scss'],
  standalone: false
})
export class AchievementFormPage implements OnInit {
  @Input() achid?: number;

  achievementForm!: FormGroup;
  loading: boolean = false;
  saving: boolean = false;

  validationMessages: Record<string, Record<string, string>> = {
    name: {
      required: 'El nombre del logro es obligatorio.',
      maxlength: 'El nombre no puede exceder 45 caracteres.'
    },
    criteria: {
      required: 'El criterio (formato JSON) es obligatorio.'
    },
    xp_bonus: {
      required: 'El bono de XP es obligatorio.',
      min: 'El bono de XP debe ser 0 o mayor.'
    }
  };

  constructor(private formBuilder: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController, private achievementService: AchievementService) {}

  get isEdit(): boolean {
    return this.achid !== undefined;
  }

  async ngOnInit(): Promise<void> {
    this.createForm();
    if (this.isEdit) {
      await this.loadAchievement();
    }
  }

  private createForm(): void {
    this.achievementForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(45)]],
      criteria: ['{\n  "condition": "complete_missions",\n  "count": 5\n}', [Validators.required]],
      xp_bonus: [50, [Validators.required, Validators.min(0)]]
    });
  }

  getError(controlName: string): string {
    const control = this.achievementForm.get(controlName);
    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return '';
    }
    const errorType = Object.keys(control.errors)[0];
    return this.validationMessages[controlName]?.[errorType] ?? 'Valor inválido.';
  }

  private async loadAchievement(): Promise<void> {
    if (this.achid === undefined) return;

    this.loading = true;
    try {
      const ach = await firstValueFrom(this.achievementService.detalle(this.achid));

      const criteriaText = typeof ach.criteria === 'object'
        ? JSON.stringify(ach.criteria, null, 2)
        : String(ach.criteria || '');

      this.achievementForm.patchValue({
        name: ach.name || '',
        criteria: criteriaText,
        xp_bonus: Number(ach.xp_bonus || 0)
      });
    } catch (error) {
      console.error('Error al cargar logro:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible cargar la información del logro.',
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

  async saveAchievement(): Promise<void> {
    if (this.achievementForm.invalid) {
      this.achievementForm.markAllAsTouched();
      return;
    }

    const values = this.achievementForm.value;
    let parsedCriteria: any;

    try {
      parsedCriteria = JSON.parse(values.criteria);
    } catch (e) {
      const alert = await this.alertController.create({
        header: 'JSON Inválido',
        message: 'El campo Criterio debe ser un JSON válido (ej: {"count": 10}).',
        buttons: ['Aceptar']
      });
      await alert.present();
      return;
    }

    this.saving = true;
    const payload: AchievementSave = {
      name: values.name.trim(),
      criteria: parsedCriteria,
      xp_bonus: Number(values.xp_bonus)
    };

    try {
      if (this.isEdit && this.achid !== undefined) {
        await firstValueFrom(this.achievementService.actualizar(this.achid, payload));
      } else {
        await firstValueFrom(this.achievementService.crear(payload));
      }

      const alert = await this.alertController.create({
        header: this.isEdit ? 'Logro actualizado' : 'Logro creado',
        message: this.isEdit
          ? 'El logro fue actualizado correctamente.'
          : 'El logro fue registrado exitosamente.',
        buttons: ['Aceptar']
      });
      await alert.present();
      await alert.onDidDismiss();

      await this.modalController.dismiss({ saved: true });
    } catch (error) {
      console.error('Error al guardar logro:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible guardar el logro. Verifica los datos enviados.',
        buttons: ['Aceptar']
      });
      await alert.present();
    } finally {
      this.saving = false;
    }
  }
}
