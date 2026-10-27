import { firstValueFrom } from 'rxjs';
import { RankService } from '../services/rank';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';

interface RankSave {
  title: string;
  min_xp: number;
  badge_icon?: string | null;
}

interface RankDetail {
  ranid: number;
  title: string;
  min_xp: number;
  badge_icon?: string | null;
}

@Component({
  selector: 'app-rank-form',
  templateUrl: './rank-form.page.html',
  styleUrls: ['./rank-form.page.scss'],
  standalone: false
})
export class RankFormPage implements OnInit {
  @Input() ranid?: number;

  rankForm!: FormGroup;
  loading: boolean = false;
  saving: boolean = false;

  validationMessages: Record<string, Record<string, string>> = {
    title: {
      required: 'El título del rango es obligatorio.',
      maxlength: 'El título no puede exceder 45 caracteres.'
    },
    min_xp: {
      required: 'El mínimo de XP es obligatorio.',
      min: 'El mínimo de XP debe ser 0 o mayor.'
    }
  };

  constructor(private formBuilder: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController, private rankService: RankService) {}

  get isEdit(): boolean {
    return this.ranid !== undefined;
  }

  async ngOnInit(): Promise<void> {
    this.createForm();
    if (this.isEdit) {
      await this.loadRank();
    }
  }

  private createForm(): void {
    this.rankForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(45)]],
      min_xp: [0, [Validators.required, Validators.min(0)]],
      badge_icon: ['']
    });
  }

  getError(controlName: string): string {
    const control = this.rankForm.get(controlName);
    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return '';
    }
    const errorType = Object.keys(control.errors)[0];
    return this.validationMessages[controlName]?.[errorType] ?? 'Valor inválido.';
  }

  private async loadRank(): Promise<void> {
    if (this.ranid === undefined) return;

    this.loading = true;
    try {
      const rank = await firstValueFrom(this.rankService.detalle(this.ranid));

      const titleVal = rank.title || (rank as any).tittle || '';

      this.rankForm.patchValue({
        title: titleVal,
        min_xp: Number(rank.min_xp || 0),
        badge_icon: rank.badge_icon || ''
      });
    } catch (error) {
      console.error('Error al cargar rango:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible cargar la información del rango.',
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

  async saveRank(): Promise<void> {
    if (this.rankForm.invalid) {
      this.rankForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const values = this.rankForm.value;

    const payload: any = {
      title: values.title.trim(),
      min_xp: Number(values.min_xp)
    };

    if (values.badge_icon) {
      payload.badge_icon = values.badge_icon.trim();
    }

    try {
      if (this.isEdit && this.ranid !== undefined) {
        await firstValueFrom(this.rankService.actualizar(this.ranid, payload));
      } else {
        await firstValueFrom(this.rankService.crear(payload));
      }

      const alert = await this.alertController.create({
        header: this.isEdit ? 'Rango actualizado' : 'Rango creado',
        message: this.isEdit
          ? 'El rango fue actualizado correctamente.'
          : 'El rango fue registrado exitosamente.',
        buttons: ['Aceptar']
      });
      await alert.present();
      await alert.onDidDismiss();

      await this.modalController.dismiss({ saved: true });
    } catch (error) {
      console.error('Error al guardar rango:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible guardar el rango.',
        buttons: ['Aceptar']
      });
      await alert.present();
    } finally {
      this.saving = false;
    }
  }
}
