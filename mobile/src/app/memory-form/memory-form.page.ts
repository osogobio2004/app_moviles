import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { MemoryGuardar, MemoryService } from '../services/memory';
import { Tag, TagService } from '../services/tag';

@Component({
  selector: 'app-memory-form',
  templateUrl: './memory-form.page.html',
  styleUrls: ['./memory-form.page.scss'],
  standalone: false
})
export class MemoryFormPage implements OnInit {
  @Input() memid?: number;

  tagsDisponibles: Tag[] = [];
  enlacesTags: { id: number; tagId: number }[] = [];
  mensajeTags: string = '';

  memoryForm!: FormGroup;
  loading: boolean = false;
  saving: boolean = false;

  validationMessages: Record<string, Record<string, string>> = {
    note: {
      required: 'La nota o recuerdo es obligatorio.',
      maxlength: 'La nota no puede exceder 1000 caracteres.'
    },
    captured_at: {
      required: 'La fecha del recuerdo es obligatoria.'
    },
    couidfk: {
      required: 'El ID de pareja es obligatorio.',
      min: 'El ID de pareja debe ser mayor a 0.'
    }
  };

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController,
    private memoryService: MemoryService,
    private tagService: TagService
  ) {}

  get isEdit(): boolean {
    return this.memid !== undefined;
  }

  get tagsFA(): FormArray {
    return this.memoryForm.get('tags') as FormArray;
  }

  agregarTag(): void {
    this.tagsFA.push(new FormControl(null, Validators.required));
  }

  eliminarTag(indice: number): void {
    this.tagsFA.removeAt(indice);
  }

  async ngOnInit(): Promise<void> {
    this.createForm();
    await this.cargarTags();

    if (this.isEdit) {
      await this.loadMemory();
    }
  }

  private createForm(): void {
    const now = new Date().toISOString().slice(0, 16);
    this.memoryForm = this.formBuilder.group({
      note: ['', [Validators.required, Validators.maxLength(1000)]],
      captured_at: [now, [Validators.required]],
      favorite: [false],
      couidfk: [1, [Validators.required, Validators.min(1)]]
    });
    this.memoryForm.addControl('tags', this.formBuilder.array([]));
  }

  private async cargarTags(): Promise<void> {
    try {
      this.tagsDisponibles = await firstValueFrom(this.tagService.listado(1, 100));
    } catch {
      this.mensajeTags = 'No fue posible consultar las etiquetas. Revisa la conexión y permisos.';
    }
  }

  getError(controlName: string): string {
    const control = this.memoryForm.get(controlName);
    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return '';
    }
    const errorType = Object.keys(control.errors)[0];
    return this.validationMessages[controlName]?.[errorType] ?? 'Valor inválido.';
  }

  private async loadMemory(): Promise<void> {
    if (this.memid === undefined) return;

    this.loading = true;
    try {
      const memory = await firstValueFrom(this.memoryService.detalle(this.memid));

      this.enlacesTags = (memory.tags ?? []).map(enlace => ({
        id: enlace.labid,
        tagId: enlace.tagidfk.tagid
      }));

      this.tagsFA.clear();
      for (const enlace of this.enlacesTags) {
        this.tagsFA.push(new FormControl(enlace.tagId, Validators.required));
      }

      let dateStr = memory.captured_at || '';
      if (dateStr && dateStr.includes('.')) {
        dateStr = dateStr.split('.')[0];
      }
      if (dateStr && dateStr.endsWith('Z')) {
        dateStr = dateStr.replace('Z', '');
      }

      this.memoryForm.patchValue({
        note: memory.note || '',
        captured_at: dateStr,
        favorite: Boolean(memory.favorite),
        couidfk: Number(memory.couidfk || 1)
      });
    } catch (error) {
      console.error('Error al cargar recuerdo:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible cargar la información del recuerdo.',
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

  async saveMemory(): Promise<void> {
    if (this.saving) return;

    if (this.memoryForm.invalid) {
      this.memoryForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const values = this.memoryForm.value;

    const ids = [...new Set(this.tagsFA.value.map(Number))] as number[];
    let tagsPayload: any;

    if (this.isEdit) {
      const anteriores = new Set(this.enlacesTags.map(enlace => enlace.tagId));
      tagsPayload = {
        create: ids.filter(id => !anteriores.has(id)).map(id => ({ tagidfk: id })),
        delete: this.enlacesTags.filter(enlace => !ids.includes(enlace.tagId)).map(enlace => enlace.id)
      };
    } else {
      tagsPayload = ids.map(id => ({ tagidfk: id }));
    }

    const payload: MemoryGuardar = {
      note: values.note.trim(),
      captured_at: values.captured_at,
      favorite: values.favorite ? 1 : 0,
      couidfk: Number(values.couidfk),
      tags: tagsPayload
    };

    try {
      if (this.isEdit && this.memid !== undefined) {
        await firstValueFrom(this.memoryService.actualizar(this.memid, payload));
      } else {
        await firstValueFrom(this.memoryService.crear(payload));
      }

      const alert = await this.alertController.create({
        header: this.isEdit ? 'Recuerdo actualizado' : 'Recuerdo guardado',
        message: this.isEdit
          ? 'El recuerdo fue actualizado correctamente con sus etiquetas.'
          : 'El recuerdo fue guardado exitosamente con sus etiquetas.',
        buttons: ['Aceptar']
      });
      await alert.present();
      await alert.onDidDismiss();

      await this.modalController.dismiss({ saved: true });
    } catch (error) {
      console.error('Error al guardar recuerdo:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No fue posible guardar el recuerdo. Revisa los datos y permisos en Directus.',
        buttons: ['Aceptar']
      });
      await alert.present();
    } finally {
      this.saving = false;
    }
  }
}
