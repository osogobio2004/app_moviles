import { firstValueFrom } from 'rxjs';
import { LocationService } from '../services/location';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';

interface LocationSave {
  place_name: string;
  latitude?: number | null;
  longitude?: number | null;
  jouidfk: number;
}

interface LocationDetail {
  locid: number;
  place_name: string;
  latitude?: number | null;
  longitude?: number | null;
  jouidfk: number;
}

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.page.html',
  styleUrls: ['./location-form.page.scss'],
  standalone: false
})
export class LocationFormPage implements OnInit {
  @Input() locid?: number;

  locationForm!: FormGroup;
  loading: boolean = false;
  saving: boolean = false;

  validationMessages: Record<string, Record<string, string>> = {
    place_name: {
      required: 'El nombre del lugar es obligatorio.',
      maxlength: 'El nombre no puede exceder 100 caracteres.'
    },
    jouidfk: {
      required: 'El ID del viaje asociado es obligatorio.',
      min: 'El ID de viaje debe ser mayor a 0.'
    }
  };

  constructor(private formBuilder: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController, private locationService: LocationService) {}

  get isEdit(): boolean {
    return this.locid !== undefined;
  }

  async ngOnInit(): Promise<void> {
    this.createForm();
    if (this.isEdit) {
      await this.loadLocation();
    }
  }

  private createForm(): void {
    this.locationForm = this.formBuilder.group({
      place_name: ['', [Validators.required, Validators.maxLength(100)]],
      latitude: [null],
      longitude: [null],
      jouidfk: [1, [Validators.required, Validators.min(1)]]
    });
  }

  getError(controlName: string): string {
    const control = this.locationForm.get(controlName);
    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return '';
    }
    const errorType = Object.keys(control.errors)[0];
    return this.validationMessages[controlName]?.[errorType] ?? 'Valor inválido.';
  }

  private async loadLocation(): Promise<void> {
    if (this.locid === undefined) return;

    this.loading = true;
    try {
      const loc = await firstValueFrom(this.locationService.detalle(this.locid));

      this.locationForm.patchValue({
        place_name: loc.place_name || '',
        latitude: loc.latitude !== null && loc.latitude !== undefined ? Number(loc.latitude) : null,
        longitude: loc.longitude !== null && loc.longitude !== undefined ? Number(loc.longitude) : null,
        jouidfk: Number(loc.jouidfk || 1)
      });
    } catch (error) {
      console.error('Error al cargar ubicación:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible cargar la información del lugar.',
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

  async saveLocation(): Promise<void> {
    if (this.locationForm.invalid) {
      this.locationForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const values = this.locationForm.value;

    const payload: LocationSave = {
      place_name: values.place_name.trim(),
      latitude: values.latitude !== '' && values.latitude !== null ? Number(values.latitude) : null,
      longitude: values.longitude !== '' && values.longitude !== null ? Number(values.longitude) : null,
      jouidfk: Number(values.jouidfk)
    };

    try {
      if (this.isEdit && this.locid !== undefined) {
        await firstValueFrom(this.locationService.actualizar(this.locid, payload));
      } else {
        await firstValueFrom(this.locationService.crear(payload));
      }

      const alert = await this.alertController.create({
        header: this.isEdit ? 'Ubicación actualizada' : 'Ubicación creada',
        message: this.isEdit
          ? 'El lugar fue actualizado correctamente.'
          : 'El lugar fue registrado exitosamente.',
        buttons: ['Aceptar']
      });
      await alert.present();
      await alert.onDidDismiss();

      await this.modalController.dismiss({ saved: true });
    } catch (error) {
      console.error('Error al guardar ubicación:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible guardar el lugar. Verifica que el ID de viaje exista.',
        buttons: ['Aceptar']
      });
      await alert.present();
    } finally {
      this.saving = false;
    }
  }
}
