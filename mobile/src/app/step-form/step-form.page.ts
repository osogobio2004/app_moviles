import { firstValueFrom } from 'rxjs';
import { StepService } from '../services/step';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';

interface StepSave {
  instruction: string;
  order_num: number;
  is_done: number | boolean;
  misidfk: number;
}

interface StepDetail {
  steid: number;
  instruction: string;
  order_num: number;
  is_done: number | boolean;
  misidfk: number;
}

@Component({
  selector: 'app-step-form',
  templateUrl: './step-form.page.html',
  styleUrls: ['./step-form.page.scss'],
  standalone: false
})
export class StepFormPage implements OnInit {
  @Input() steid?: number;

  stepForm!: FormGroup;
  loading: boolean = false;
  saving: boolean = false;

  validationMessages: Record<string, Record<string, string>> = {
    instruction: {
      required: 'La instrucción del paso es obligatoria.',
      maxlength: 'La instrucción no puede exceder 255 caracteres.'
    },
    order_num: {
      required: 'El número de orden es obligatorio.',
      min: 'El número de orden debe ser al menos 1.'
    },
    misidfk: {
      required: 'El ID de la misión asociada es obligatorio.',
      min: 'El ID de misión debe ser mayor a 0.'
    }
  };

  constructor(private formBuilder: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController, private stepService: StepService) {}

  get isEdit(): boolean {
    return this.steid !== undefined;
  }

  async ngOnInit(): Promise<void> {
    this.createForm();
    if (this.isEdit) {
      await this.loadStep();
    }
  }

  private createForm(): void {
    this.stepForm = this.formBuilder.group({
      instruction: ['', [Validators.required, Validators.maxLength(255)]],
      order_num: [1, [Validators.required, Validators.min(1)]],
      is_done: [false],
      misidfk: [1, [Validators.required, Validators.min(1)]]
    });
  }

  getError(controlName: string): string {
    const control = this.stepForm.get(controlName);
    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return '';
    }
    const errorType = Object.keys(control.errors)[0];
    return this.validationMessages[controlName]?.[errorType] ?? 'Valor inválido.';
  }

  private async loadStep(): Promise<void> {
    if (this.steid === undefined) return;

    this.loading = true;
    try {
      const step = await firstValueFrom(this.stepService.detalle(this.steid));

      this.stepForm.patchValue({
        instruction: step.instruction || '',
        order_num: Number(step.order_num || 1),
        is_done: Boolean(step.is_done),
        misidfk: Number(step.misidfk || 1)
      });
    } catch (error) {
      console.error('Error al cargar paso:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible cargar la información del paso.',
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

  async saveStep(): Promise<void> {
    if (this.stepForm.invalid) {
      this.stepForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const values = this.stepForm.value;

    const payload: StepSave = {
      instruction: values.instruction.trim(),
      order_num: Number(values.order_num),
      is_done: values.is_done ? 1 : 0,
      misidfk: Number(values.misidfk)
    };

    try {
      if (this.isEdit && this.steid !== undefined) {
        await firstValueFrom(this.stepService.actualizar(this.steid, payload));
      } else {
        await firstValueFrom(this.stepService.crear(payload));
      }

      const alert = await this.alertController.create({
        header: this.isEdit ? 'Paso actualizado' : 'Paso creado',
        message: this.isEdit
          ? 'El paso fue actualizado correctamente.'
          : 'El paso fue registrado exitosamente.',
        buttons: ['Aceptar']
      });
      await alert.present();
      await alert.onDidDismiss();

      await this.modalController.dismiss({ saved: true });
    } catch (error) {
      console.error('Error al guardar paso:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible guardar el paso. Verifica que el ID de misión exista.',
        buttons: ['Aceptar']
      });
      await alert.present();
    } finally {
      this.saving = false;
    }
  }
}
