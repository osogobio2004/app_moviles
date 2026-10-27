import { firstValueFrom } from 'rxjs';
import { RewardService } from '../services/reward';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';

interface RewardSave {
  item_name: string;
  item_type: 'frame' | 'theme' | 'badge';
  cost_xp: number;
  rank_ranid: number;
  ranidfk?: number | null;
}

interface RewardDetail {
  rewid: number;
  item_name: string;
  item_type: 'frame' | 'theme' | 'badge';
  cost_xp: number;
  rank_ranid: number;
  ranidfk?: number | null;
}

@Component({
  selector: 'app-reward-form',
  templateUrl: './reward-form.page.html',
  styleUrls: ['./reward-form.page.scss'],
  standalone: false
})
export class RewardFormPage implements OnInit {
  @Input() rewid?: number;

  rewardForm!: FormGroup;
  loading: boolean = false;
  saving: boolean = false;

  validationMessages: Record<string, Record<string, string>> = {
    item_name: {
      required: 'El nombre de la recompensa es obligatorio.',
      maxlength: 'El nombre no puede exceder 45 caracteres.'
    },
    item_type: {
      required: 'El tipo de ítem es obligatorio.'
    },
    cost_xp: {
      required: 'El costo en XP es obligatorio.',
      min: 'El costo en XP debe ser 0 o mayor.'
    },
    rank_ranid: {
      required: 'El rango requerido es obligatorio.',
      min: 'El ID de rango debe ser mayor a 0.'
    }
  };

  constructor(private formBuilder: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController, private rewardService: RewardService) {}

  get isEdit(): boolean {
    return this.rewid !== undefined;
  }

  async ngOnInit(): Promise<void> {
    this.createForm();
    if (this.isEdit) {
      await this.loadReward();
    }
  }

  private createForm(): void {
    this.rewardForm = this.formBuilder.group({
      item_name: ['', [Validators.required, Validators.maxLength(45)]],
      item_type: ['frame', [Validators.required]],
      cost_xp: [100, [Validators.required, Validators.min(0)]],
      rank_ranid: [1, [Validators.required, Validators.min(1)]]
    });
  }

  getError(controlName: string): string {
    const control = this.rewardForm.get(controlName);
    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return '';
    }
    const errorType = Object.keys(control.errors)[0];
    return this.validationMessages[controlName]?.[errorType] ?? 'Valor inválido.';
  }

  private async loadReward(): Promise<void> {
    if (this.rewid === undefined) return;

    this.loading = true;
    try {
      const reward = await firstValueFrom(this.rewardService.detalle(this.rewid));

      this.rewardForm.patchValue({
        item_name: reward.item_name || '',
        item_type: reward.item_type || 'frame',
        cost_xp: Number(reward.cost_xp || 0),
        rank_ranid: Number(reward.rank_ranid || 1)
      });
    } catch (error) {
      console.error('Error al cargar recompensa:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible cargar la información de la recompensa.',
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

  async saveReward(): Promise<void> {
    if (this.rewardForm.invalid) {
      this.rewardForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const values = this.rewardForm.value;

    const payload: RewardSave = {
      item_name: values.item_name.trim(),
      item_type: values.item_type,
      cost_xp: Number(values.cost_xp),
      rank_ranid: Number(values.rank_ranid),
      ranidfk: Number(values.rank_ranid)
    };

    try {
      if (this.isEdit && this.rewid !== undefined) {
        await firstValueFrom(this.rewardService.actualizar(this.rewid, payload));
      } else {
        await firstValueFrom(this.rewardService.crear(payload));
      }

      const alert = await this.alertController.create({
        header: this.isEdit ? 'Recompensa actualizada' : 'Recompensa creada',
        message: this.isEdit
          ? 'La recompensa fue actualizada correctamente.'
          : 'La recompensa fue registrada exitosamente.',
        buttons: ['Aceptar']
      });
      await alert.present();
      await alert.onDidDismiss();

      await this.modalController.dismiss({ saved: true });
    } catch (error) {
      console.error('Error al guardar recompensa:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible guardar la recompensa. Verifica que el ID de rango exista.',
        buttons: ['Aceptar']
      });
      await alert.present();
    } finally {
      this.saving = false;
    }
  }
}
