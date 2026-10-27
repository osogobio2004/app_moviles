import { firstValueFrom } from 'rxjs';
import { InventoryService } from '../services/inventory';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';

interface InventorySave {
  acquired_at: string;
  is_equipped: number | boolean;
  couidfk: number;
  rewidfk: number;
}

interface InventoryDetail {
  invid: number;
  acquired_at: string;
  is_equipped: number | boolean;
  couidfk: number;
  rewidfk: number;
}

@Component({
  selector: 'app-inventory-form',
  templateUrl: './inventory-form.page.html',
  styleUrls: ['./inventory-form.page.scss'],
  standalone: false
})
export class InventoryFormPage implements OnInit {
  @Input() invid?: number;

  inventoryForm!: FormGroup;
  loading: boolean = false;
  saving: boolean = false;

  validationMessages: Record<string, Record<string, string>> = {
    acquired_at: {
      required: 'La fecha de adquisición es obligatoria.'
    },
    couidfk: {
      required: 'El ID de la pareja es obligatorio.',
      min: 'El ID debe ser mayor a 0.'
    },
    rewidfk: {
      required: 'El ID de la recompensa es obligatorio.',
      min: 'El ID debe ser mayor a 0.'
    }
  };

  constructor(private formBuilder: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController, private inventoryService: InventoryService) {}

  get isEdit(): boolean {
    return this.invid !== undefined;
  }

  async ngOnInit(): Promise<void> {
    this.createForm();
    if (this.isEdit) {
      await this.loadInventory();
    }
  }

  private createForm(): void {
    const nowIso = new Date().toISOString().substring(0, 16);
    this.inventoryForm = this.formBuilder.group({
      acquired_at: [nowIso, [Validators.required]],
      is_equipped: [false],
      couidfk: [1, [Validators.required, Validators.min(1)]],
      rewidfk: [1, [Validators.required, Validators.min(1)]]
    });
  }

  getError(controlName: string): string {
    const control = this.inventoryForm.get(controlName);
    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return '';
    }
    const errorType = Object.keys(control.errors)[0];
    return this.validationMessages[controlName]?.[errorType] ?? 'Valor inválido.';
  }

  private async loadInventory(): Promise<void> {
    if (this.invid === undefined) return;

    this.loading = true;
    try {
      const inv = await firstValueFrom(this.inventoryService.detalle(this.invid));

      let aDate = inv.acquired_at;
      if (aDate && aDate.length > 16) {
        aDate = aDate.substring(0, 16);
      }

      this.inventoryForm.patchValue({
        acquired_at: aDate || '',
        is_equipped: Boolean(inv.is_equipped),
        couidfk: Number(inv.couidfk || 1),
        rewidfk: Number(inv.rewidfk || 1)
      });
    } catch (error) {
      console.error('Error al cargar inventario:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible cargar la información del ítem en inventario.',
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

  async saveInventory(): Promise<void> {
    if (this.inventoryForm.invalid) {
      this.inventoryForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const values = this.inventoryForm.value;

    let aDate = values.acquired_at;
    if (aDate && aDate.length === 16) {
      aDate = `${aDate}:00`;
    }

    const payload: InventorySave = {
      acquired_at: aDate,
      is_equipped: values.is_equipped ? 1 : 0,
      couidfk: Number(values.couidfk),
      rewidfk: Number(values.rewidfk)
    };

    try {
      if (this.isEdit && this.invid !== undefined) {
        await firstValueFrom(this.inventoryService.actualizar(this.invid, payload));
      } else {
        await firstValueFrom(this.inventoryService.crear(payload));
      }

      const alert = await this.alertController.create({
        header: this.isEdit ? 'Ítem actualizado' : 'Ítem añadido',
        message: this.isEdit
          ? 'El ítem de inventario fue actualizado correctamente.'
          : 'El ítem fue añadido al inventario exitosamente.',
        buttons: ['Aceptar']
      });
      await alert.present();
      await alert.onDidDismiss();

      await this.modalController.dismiss({ saved: true });
    } catch (error) {
      console.error('Error al guardar inventario:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible guardar el registro de inventario. Verifica que el ID de pareja y recompensa existan.',
        buttons: ['Aceptar']
      });
      await alert.present();
    } finally {
      this.saving = false;
    }
  }
}
