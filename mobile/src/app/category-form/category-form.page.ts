import { firstValueFrom } from 'rxjs';
import { CategoryService } from '../services/category';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import axios from 'axios';
import { environment } from '../../environments/environment';

interface CategorySave {
  name: string;
  color_hex: string;
  is_active: boolean | number;
  xp_value: number;
}

interface CategoryDetail {
  catid: number;
  name: string;
  color_hex: string;
  is_active: boolean | number;
  xp_value: number;
}

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.page.html',
  styleUrls: ['./category-form.page.scss'],
  standalone: false
})
export class CategoryFormPage implements OnInit {
  @Input() catid?: number;

  categoryForm!: FormGroup;
  loading: boolean = false;
  saving: boolean = false;

  validationMessages: Record<string, Record<string, string>> = {
    name: {
      required: 'El nombre de la categoría es obligatorio.',
      maxlength: 'El nombre no puede exceder 45 caracteres.'
    },
    color_hex: {
      required: 'El color hexadecimal es obligatorio.',
      pattern: 'El formato de color debe ser hexadecimal (ej: #FF5733).'
    },
    xp_value: {
      required: 'El valor en XP es obligatorio.',
      min: 'El valor en XP debe ser 0 o mayor.'
    }
  };

  constructor(private formBuilder: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController, private categoryService: CategoryService) {}

  get isEdit(): boolean {
    return this.catid !== undefined;
  }

  async ngOnInit(): Promise<void> {
    this.createForm();
    if (this.isEdit) {
      await this.loadCategory();
    }
  }

  private createForm(): void {
    this.categoryForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(45)]],
      color_hex: ['#FF5733', [Validators.required, Validators.pattern(/^#[0-9A-Fa-f]{6}$/)]],
      is_active: [true],
      xp_value: [50, [Validators.required, Validators.min(0)]]
    });
  }

  getError(controlName: string): string {
    const control = this.categoryForm.get(controlName);
    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return '';
    }
    const errorType = Object.keys(control.errors)[0];
    return this.validationMessages[controlName]?.[errorType] ?? 'Valor inválido.';
  }

  private async loadCategory(): Promise<void> {
    if (this.catid === undefined) return;

    this.loading = true;
    try {
      const category = await firstValueFrom(this.categoryService.detalle(this.catid));

      this.categoryForm.patchValue({
        name: category.name || '',
        color_hex: category.color_hex || '#FF5733',
        is_active: Boolean(category.is_active),
        xp_value: Number(category.xp_value || 0)
      });
    } catch (error) {
      console.error('Error al cargar categoría:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible cargar la información de la categoría.',
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

  async saveCategory(): Promise<void> {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const values = this.categoryForm.value;

    const payload: CategorySave = {
      name: values.name.trim(),
      color_hex: values.color_hex.trim(),
      is_active: values.is_active ? 1 : 0,
      xp_value: Number(values.xp_value)
    };

    try {
      if (this.isEdit && this.catid !== undefined) {
        await firstValueFrom(this.categoryService.actualizar(this.catid, payload));
      } else {
        await firstValueFrom(this.categoryService.crear(payload));
      }

      const alert = await this.alertController.create({
        header: this.isEdit ? 'Categoría actualizada' : 'Categoría creada',
        message: this.isEdit
          ? 'La categoría fue actualizada correctamente.'
          : 'La categoría fue registrada exitosamente.',
        buttons: ['Aceptar']
      });
      await alert.present();
      await alert.onDidDismiss();

      await this.modalController.dismiss({ saved: true });
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible guardar la categoría. Verifica los campos introducidos.',
        buttons: ['Aceptar']
      });
      await alert.present();
    } finally {
      this.saving = false;
    }
  }
}
