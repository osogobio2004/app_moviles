import { firstValueFrom } from 'rxjs';
import { TokenService } from '../services/token';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';

interface TokenSave {
  code: string;
  created_at: string;
  expires_at: string;
  is_used: number | boolean;
  couidfk: number;
}

interface TokenDetail {
  tokid: number;
  code: string;
  created_at: string;
  expires_at: string;
  is_used: number | boolean;
  couidfk: number;
}

@Component({
  selector: 'app-token-form',
  templateUrl: './token-form.page.html',
  styleUrls: ['./token-form.page.scss'],
  standalone: false
})
export class TokenFormPage implements OnInit {
  @Input() tokid?: number;

  tokenForm!: FormGroup;
  loading: boolean = false;
  saving: boolean = false;

  validationMessages: Record<string, Record<string, string>> = {
    code: {
      required: 'El código es obligatorio.',
      maxlength: 'El código no puede exceder 8 caracteres.'
    },
    created_at: {
      required: 'La fecha de creación es obligatoria.'
    },
    expires_at: {
      required: 'La fecha de expiración es obligatoria.'
    },
    couidfk: {
      required: 'El ID de pareja es obligatorio.',
      min: 'El ID debe ser mayor a 0.'
    }
  };

  constructor(private formBuilder: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController, private tokenService: TokenService) {}

  get isEdit(): boolean {
    return this.tokid !== undefined;
  }

  async ngOnInit(): Promise<void> {
    this.createForm();
    if (this.isEdit) {
      await this.loadToken();
    }
  }

  private createForm(): void {
    const now = new Date();
    const createdIso = now.toISOString().substring(0, 16);
    const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const expiresIso = expires.toISOString().substring(0, 16);

    const randomCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    this.tokenForm = this.formBuilder.group({
      code: [randomCode, [Validators.required, Validators.maxLength(8)]],
      created_at: [createdIso, [Validators.required]],
      expires_at: [expiresIso, [Validators.required]],
      is_used: [false],
      couidfk: [1, [Validators.required, Validators.min(1)]]
    });
  }

  getError(controlName: string): string {
    const control = this.tokenForm.get(controlName);
    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return '';
    }
    const errorType = Object.keys(control.errors)[0];
    return this.validationMessages[controlName]?.[errorType] ?? 'Valor inválido.';
  }

  private async loadToken(): Promise<void> {
    if (this.tokid === undefined) return;

    this.loading = true;
    try {
      const tok = await firstValueFrom(this.tokenService.detalle(this.tokid));

      let cDate = tok.created_at;
      if (cDate && cDate.length > 16) {
        cDate = cDate.substring(0, 16);
      }

      let eDate = tok.expires_at;
      if (eDate && eDate.length > 16) {
        eDate = eDate.substring(0, 16);
      }

      this.tokenForm.patchValue({
        code: tok.code || '',
        created_at: cDate || '',
        expires_at: eDate || '',
        is_used: Boolean(tok.is_used),
        couidfk: Number(tok.couidfk || 1)
      });
    } catch (error) {
      console.error('Error al cargar token:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible cargar la información del token.',
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

  async saveToken(): Promise<void> {
    if (this.tokenForm.invalid) {
      this.tokenForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const values = this.tokenForm.value;

    let cDate = values.created_at;
    if (cDate && cDate.length === 16) {
      cDate = `${cDate}:00`;
    }

    let eDate = values.expires_at;
    if (eDate && eDate.length === 16) {
      eDate = `${eDate}:00`;
    }

    const payload: TokenSave = {
      code: values.code.trim().toUpperCase(),
      created_at: cDate,
      expires_at: eDate,
      is_used: values.is_used ? 1 : 0,
      couidfk: Number(values.couidfk)
    };

    try {
      if (this.isEdit && this.tokid !== undefined) {
        await firstValueFrom(this.tokenService.actualizar(this.tokid, payload));
      } else {
        await firstValueFrom(this.tokenService.crear(payload));
      }

      const alert = await this.alertController.create({
        header: this.isEdit ? 'Token actualizado' : 'Token creado',
        message: this.isEdit
          ? 'El token fue actualizado correctamente.'
          : 'El token fue generado exitosamente.',
        buttons: ['Aceptar']
      });
      await alert.present();
      await alert.onDidDismiss();

      await this.modalController.dismiss({ saved: true });
    } catch (error) {
      console.error('Error al guardar token:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible guardar el token. Verifica que el ID de pareja exista.',
        buttons: ['Aceptar']
      });
      await alert.present();
    } finally {
      this.saving = false;
    }
  }
}
