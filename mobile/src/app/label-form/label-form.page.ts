import { firstValueFrom } from 'rxjs';
import { LabelService } from '../services/label';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';

interface LabelSave {
  assigment_at: string;
  memidfk: number;
  tagidfk: number;
}

interface LabelDetail {
  labid: number;
  assigment_at: string;
  memidfk: number;
  tagidfk: number;
}

@Component({
  selector: 'app-label-form',
  templateUrl: './label-form.page.html',
  styleUrls: ['./label-form.page.scss'],
  standalone: false
})
export class LabelFormPage implements OnInit {
  @Input() labid?: number;

  labelForm!: FormGroup;
  loading: boolean = false;
  saving: boolean = false;

  validationMessages: Record<string, Record<string, string>> = {
    assigment_at: {
      required: 'La fecha de asignación es obligatoria.'
    },
    memidfk: {
      required: 'El ID de recuerdo es obligatorio.',
      min: 'El ID debe ser mayor a 0.'
    },
    tagidfk: {
      required: 'El ID de etiqueta es obligatorio.',
      min: 'El ID debe ser mayor a 0.'
    }
  };

  constructor(private formBuilder: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController, private labelService: LabelService) {}

  get isEdit(): boolean {
    return this.labid !== undefined;
  }

  async ngOnInit(): Promise<void> {
    this.createForm();
    if (this.isEdit) {
      await this.loadLabel();
    }
  }

  private createForm(): void {
    const nowIso = new Date().toISOString().substring(0, 16);
    this.labelForm = this.formBuilder.group({
      assigment_at: [nowIso, [Validators.required]],
      memidfk: [1, [Validators.required, Validators.min(1)]],
      tagidfk: [1, [Validators.required, Validators.min(1)]]
    });
  }

  getError(controlName: string): string {
    const control = this.labelForm.get(controlName);
    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return '';
    }
    const errorType = Object.keys(control.errors)[0];
    return this.validationMessages[controlName]?.[errorType] ?? 'Valor inválido.';
  }

  private async loadLabel(): Promise<void> {
    if (this.labid === undefined) return;

    this.loading = true;
    try {
      const label = await firstValueFrom(this.labelService.detalle(this.labid));

      let aDate = label.assigment_at;
      if (aDate && aDate.length > 16) {
        aDate = aDate.substring(0, 16);
      }

      this.labelForm.patchValue({
        assigment_at: aDate || '',
        memidfk: Number(label.memidfk || 1),
        tagidfk: Number(label.tagidfk || 1)
      });
    } catch (error) {
      console.error('Error al cargar asignación de etiqueta:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible cargar la información de la asignación.',
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

  async saveLabel(): Promise<void> {
    if (this.labelForm.invalid) {
      this.labelForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const values = this.labelForm.value;

    let aDate = values.assigment_at;
    if (aDate && aDate.length === 16) {
      aDate = `${aDate}:00`;
    }

    const payload: LabelSave = {
      assigment_at: aDate,
      memidfk: Number(values.memidfk),
      tagidfk: Number(values.tagidfk)
    };

    try {
      if (this.isEdit && this.labid !== undefined) {
        await firstValueFrom(this.labelService.actualizar(this.labid, payload));
      } else {
        await firstValueFrom(this.labelService.crear(payload));
      }

      const alert = await this.alertController.create({
        header: this.isEdit ? 'Asignación actualizada' : 'Asignación creada',
        message: this.isEdit
          ? 'La etiqueta fue actualizada en el recuerdo correctamente.'
          : 'La etiqueta fue vinculada al recuerdo exitosamente.',
        buttons: ['Aceptar']
      });
      await alert.present();
      await alert.onDidDismiss();

      await this.modalController.dismiss({ saved: true });
    } catch (error) {
      console.error('Error al guardar asignación:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible guardar la asignación. Verifica que el ID de recuerdo y etiqueta existan.',
        buttons: ['Aceptar']
      });
      await alert.present();
    } finally {
      this.saving = false;
    }
  }
}
