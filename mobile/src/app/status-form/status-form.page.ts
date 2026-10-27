import { firstValueFrom } from 'rxjs';
import { StatusService } from '../services/status';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';

interface StatusSave {
  description: 'PENDIENTE' | 'EN PROGRESO' | 'COMPLETADO';
}

interface StatusDetail {
  staid: number;
  description: 'PENDIENTE' | 'EN PROGRESO' | 'COMPLETADO';
}

@Component({
  selector: 'app-status-form',
  templateUrl: './status-form.page.html',
  styleUrls: ['./status-form.page.scss'],
  standalone: false
})
export class StatusFormPage implements OnInit {
  @Input() staid?: number;

  statusForm!: FormGroup;
  loading: boolean = false;
  saving: boolean = false;

  validationMessages: Record<string, Record<string, string>> = {
    description: {
      required: 'La descripción del estado es obligatoria.'
    }
  };

  constructor(private formBuilder: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController, private statusService: StatusService) {}

  get isEdit(): boolean {
    return this.staid !== undefined;
  }

  async ngOnInit(): Promise<void> {
    this.createForm();
    if (this.isEdit) {
      await this.loadStatus();
    }
  }

  private createForm(): void {
    this.statusForm = this.formBuilder.group({
      description: ['PENDIENTE', [Validators.required]]
    });
  }

  getError(controlName: string): string {
    const control = this.statusForm.get(controlName);
    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return '';
    }
    const errorType = Object.keys(control.errors)[0];
    return this.validationMessages[controlName]?.[errorType] ?? 'Valor inválido.';
  }

  private async loadStatus(): Promise<void> {
    if (this.staid === undefined) return;

    this.loading = true;
    try {
      const sta = await firstValueFrom(this.statusService.detalle(this.staid));

      this.statusForm.patchValue({
        description: sta.description || 'PENDIENTE'
      });
    } catch (error) {
      console.error('Error al cargar estado:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible cargar la información del estado.',
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

  async saveStatus(): Promise<void> {
    if (this.statusForm.invalid) {
      this.statusForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const values = this.statusForm.value;

    const payload: StatusSave = {
      description: values.description
    };

    try {
      if (this.isEdit && this.staid !== undefined) {
        await firstValueFrom(this.statusService.actualizar(this.staid, payload));
      } else {
        await firstValueFrom(this.statusService.crear(payload));
      }

      const alert = await this.alertController.create({
        header: this.isEdit ? 'Estado actualizado' : 'Estado creado',
        message: this.isEdit
          ? 'El estado fue actualizado correctamente.'
          : 'El estado fue registrado exitosamente.',
        buttons: ['Aceptar']
      });
      await alert.present();
      await alert.onDidDismiss();

      await this.modalController.dismiss({ saved: true });
    } catch (error) {
      console.error('Error al guardar estado:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible guardar el estado.',
        buttons: ['Aceptar']
      });
      await alert.present();
    } finally {
      this.saving = false;
    }
  }
}
