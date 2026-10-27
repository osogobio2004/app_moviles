import { firstValueFrom } from 'rxjs';
import { JourneyService } from '../services/journey';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';

interface JourneySave {
  destination: string;
  budget: number;
  planned_day: string;
  couidfk: number;
  staidfk: number;
  visited_at?: string | null;
}

interface JourneyDetail {
  jouid: number;
  destination: string;
  budget: number;
  planned_day: string;
  couidfk: number;
  staidfk: any;
  visited_at?: string | null;
}

@Component({
  selector: 'app-journey-form',
  templateUrl: './journey-form.page.html',
  styleUrls: ['./journey-form.page.scss'],
  standalone: false
})
export class JourneyFormPage implements OnInit {
  @Input() jouid?: number;

  journeyForm!: FormGroup;
  loading: boolean = false;
  saving: boolean = false;

  validationMessages: Record<string, Record<string, string>> = {
    destination: {
      required: 'El destino es obligatorio.',
      maxlength: 'El destino no puede exceder 255 caracteres.'
    },
    planned_day: {
      required: 'La fecha planeada es obligatoria.'
    },
    budget: {
      min: 'El presupuesto debe ser mayor o igual a 0.'
    },
    staidfk: {
      required: 'El estado es obligatorio.',
      min: 'El ID de estado debe ser mayor a 0.'
    },
    couidfk: {
      required: 'El ID de pareja es obligatorio.',
      min: 'El ID de pareja debe ser mayor a 0.'
    }
  };

  constructor(private formBuilder: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController, private journeyService: JourneyService) {}

  get isEdit(): boolean {
    return this.jouid !== undefined;
  }

  async ngOnInit(): Promise<void> {
    this.createForm();
    if (this.isEdit) {
      await this.loadJourney();
    }
  }

  private createForm(): void {
    this.journeyForm = this.formBuilder.group({
      destination: ['', [Validators.required, Validators.maxLength(255)]],
      budget: [0, [Validators.min(0)]],
      planned_day: ['', [Validators.required]],
      couidfk: [1, [Validators.required, Validators.min(1)]],
      staidfk: [1, [Validators.required, Validators.min(1)]],
      visited_at: ['']
    });
  }

  getError(controlName: string): string {
    const control = this.journeyForm.get(controlName);
    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return '';
    }
    const errorType = Object.keys(control.errors)[0];
    return this.validationMessages[controlName]?.[errorType] ?? 'Valor inválido.';
  }

  private async loadJourney(): Promise<void> {
    if (this.jouid === undefined) return;

    this.loading = true;
    try {
      const journey = await firstValueFrom(this.journeyService.detalle(this.jouid));

      let plannedDayStr = journey.planned_day || '';
      if (plannedDayStr && plannedDayStr.includes('T')) {
        plannedDayStr = plannedDayStr.split('T')[0];
      }

      let visitedAtStr = journey.visited_at || '';
      if (visitedAtStr && visitedAtStr.includes('.')) {
        visitedAtStr = visitedAtStr.split('.')[0];
      }
      if (visitedAtStr && visitedAtStr.endsWith('Z')) {
        visitedAtStr = visitedAtStr.replace('Z', '');
      }

      const staId = typeof journey.staidfk === 'object' && journey.staidfk?.staid
        ? journey.staidfk.staid
        : Number(journey.staidfk || 1);

      this.journeyForm.patchValue({
        destination: journey.destination || '',
        budget: journey.budget !== null && journey.budget !== undefined ? Number(journey.budget) : 0,
        planned_day: plannedDayStr,
        couidfk: Number(journey.couidfk || 1),
        staidfk: staId,
        visited_at: visitedAtStr
      });
    } catch (error) {
      console.error('Error al cargar datos del viaje:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible cargar los datos del viaje.',
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

  async saveJourney(): Promise<void> {
    if (this.journeyForm.invalid) {
      this.journeyForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const values = this.journeyForm.value;

    const payload: JourneySave = {
      destination: values.destination.trim(),
      budget: Number(values.budget || 0),
      planned_day: values.planned_day,
      couidfk: Number(values.couidfk),
      staidfk: Number(values.staidfk),
      visited_at: values.visited_at ? values.visited_at : null
    };

    try {
      if (this.isEdit && this.jouid !== undefined) {
        await firstValueFrom(this.journeyService.actualizar(this.jouid, payload));
      } else {
        await firstValueFrom(this.journeyService.crear(payload));
      }

      const alert = await this.alertController.create({
        header: this.isEdit ? 'Viaje actualizado' : 'Viaje registrado',
        message: this.isEdit
          ? 'El viaje fue actualizado correctamente.'
          : 'El viaje fue registrado correctamente.',
        buttons: ['Aceptar']
      });
      await alert.present();
      await alert.onDidDismiss();

      await this.modalController.dismiss({ saved: true });
    } catch (error) {
      console.error('Error al guardar viaje:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible guardar la información del viaje. Revisa que el ID de pareja y estado existan.',
        buttons: ['Aceptar']
      });
      await alert.present();
    } finally {
      this.saving = false;
    }
  }
}
