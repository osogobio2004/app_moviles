import { firstValueFrom } from 'rxjs';
import { TagService } from '../services/tag';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';

interface TagSave {
  keyword: string;
}

interface TagDetail {
  tagid: number;
  keyword: string;
}

@Component({
  selector: 'app-tag-form',
  templateUrl: './tag-form.page.html',
  styleUrls: ['./tag-form.page.scss'],
  standalone: false
})
export class TagFormPage implements OnInit {
  @Input() tagid?: number;

  tagForm!: FormGroup;
  loading: boolean = false;
  saving: boolean = false;

  validationMessages: Record<string, Record<string, string>> = {
    keyword: {
      required: 'La palabra clave de la etiqueta es obligatoria.',
      maxlength: 'La palabra clave no puede exceder 45 caracteres.'
    }
  };

  constructor(private formBuilder: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController, private tagService: TagService) {}

  get isEdit(): boolean {
    return this.tagid !== undefined;
  }

  async ngOnInit(): Promise<void> {
    this.createForm();
    if (this.isEdit) {
      await this.loadTag();
    }
  }

  private createForm(): void {
    this.tagForm = this.formBuilder.group({
      keyword: ['', [Validators.required, Validators.maxLength(45)]]
    });
  }

  getError(controlName: string): string {
    const control = this.tagForm.get(controlName);
    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return '';
    }
    const errorType = Object.keys(control.errors)[0];
    return this.validationMessages[controlName]?.[errorType] ?? 'Valor inválido.';
  }

  private async loadTag(): Promise<void> {
    if (this.tagid === undefined) return;

    this.loading = true;
    try {
      const tag = await firstValueFrom(this.tagService.detalle(this.tagid));

      this.tagForm.patchValue({
        keyword: tag.keyword || ''
      });
    } catch (error) {
      console.error('Error al cargar etiqueta:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible cargar la información de la etiqueta.',
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

  async saveTag(): Promise<void> {
    if (this.tagForm.invalid) {
      this.tagForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const values = this.tagForm.value;

    const payload: TagSave = {
      keyword: values.keyword.trim()
    };

    try {
      if (this.isEdit && this.tagid !== undefined) {
        await firstValueFrom(this.tagService.actualizar(this.tagid, payload));
      } else {
        await firstValueFrom(this.tagService.crear(payload));
      }

      const alert = await this.alertController.create({
        header: this.isEdit ? 'Etiqueta actualizada' : 'Etiqueta creada',
        message: this.isEdit
          ? 'La etiqueta fue actualizada correctamente.'
          : 'La etiqueta fue registrada exitosamente.',
        buttons: ['Aceptar']
      });
      await alert.present();
      await alert.onDidDismiss();

      await this.modalController.dismiss({ saved: true });
    } catch (error) {
      console.error('Error al guardar etiqueta:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible guardar la etiqueta.',
        buttons: ['Aceptar']
      });
      await alert.present();
    } finally {
      this.saving = false;
    }
  }
}
