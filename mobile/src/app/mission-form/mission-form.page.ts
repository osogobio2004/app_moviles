import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { MissionSave, MissionService } from '../services/mission';

@Component({
  selector: 'app-mission-form',
  templateUrl: './mission-form.page.html',
  styleUrls: ['./mission-form.page.scss'],
  standalone: false
})
export class MissionFormPage implements OnInit {
  @Input() misid?: number;

  missionForm!: FormGroup;
  loading: boolean = false;
  saving: boolean = false;

  validationMessages: Record<string, Record<string, string>> = {
    title: {
      required: 'Title is required.',
      maxlength: 'Title cannot exceed 45 characters.'
    },
    deadline: {
      required: 'Deadline is required.'
    },
    catidfk: {
      required: 'Category is required.',
      min: 'Category ID must be greater than 0.'
    },
    staidfk: {
      required: 'Status is required.',
      min: 'Status ID must be greater than 0.'
    },
    couidfk: {
      required: 'Couple ID is required.',
      min: 'Couple ID must be greater than 0.'
    }
  };

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController,
    private missionService: MissionService
  ) {}

  get isEdit(): boolean {
    return this.misid !== undefined;
  }

  async ngOnInit(): Promise<void> {
    this.createForm();
    if (this.isEdit) {
      await this.loadMission();
    }
  }

  private createForm(): void {
    this.missionForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(45)]],
      details: [''],
      deadline: ['', [Validators.required]],
      catidfk: [1, [Validators.required, Validators.min(1)]],
      staidfk: [1, [Validators.required, Validators.min(1)]],
      couidfk: [1, [Validators.required, Validators.min(1)]]
    });
  }

  getError(controlName: string): string {
    const control = this.missionForm.get(controlName);
    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return '';
    }
    const errorType = Object.keys(control.errors)[0];
    return this.validationMessages[controlName]?.[errorType] ?? 'Invalid value.';
  }

  private async loadMission(): Promise<void> {
    if (this.misid === undefined) return;

    this.loading = true;
    try {
      const mission = await firstValueFrom(this.missionService.detalle(this.misid));

      let deadlineStr = mission.deadline;
      if (deadlineStr && deadlineStr.includes('.')) {
        deadlineStr = deadlineStr.split('.')[0];
      }
      if (deadlineStr && deadlineStr.endsWith('Z')) {
        deadlineStr = deadlineStr.replace('Z', '');
      }

      this.missionForm.patchValue({
        title: mission.title || (mission as any).tittle || '',
        details: mission.details || '',
        deadline: deadlineStr,
        catidfk: typeof mission.catidfk === 'object' ? (mission.catidfk as any).catid : mission.catidfk,
        staidfk: typeof mission.staidfk === 'object' ? (mission.staidfk as any).staid : mission.staidfk,
        couidfk: mission.couidfk
      });
    } catch (error) {
      console.error('Error loading mission:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Could not load mission data.',
        buttons: ['OK']
      });
      await alert.present();
    } finally {
      this.loading = false;
    }
  }

  async closeModal(): Promise<void> {
    await this.modalController.dismiss({ saved: false });
  }

  async saveMission(): Promise<void> {
    if (this.missionForm.invalid) {
      this.missionForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const values = this.missionForm.value;

    const mission: MissionSave = {
      title: values.title.trim(),
      details: values.details?.trim() ?? '',
      deadline: values.deadline,
      catidfk: Number(values.catidfk),
      staidfk: Number(values.staidfk),
      couidfk: Number(values.couidfk)
    };

    try {
      if (this.isEdit && this.misid !== undefined) {
        await firstValueFrom(this.missionService.actualizar(this.misid, mission));
      } else {
        await firstValueFrom(this.missionService.crear(mission));
      }

      const alert = await this.alertController.create({
        header: this.isEdit ? 'Mission Updated' : 'Mission Saved',
        message: this.isEdit ? 'The mission was updated successfully.' : 'The mission was saved successfully.',
        buttons: ['OK']
      });
      await alert.present();
      await alert.onDidDismiss();

      await this.modalController.dismiss({ saved: true });
    } catch (error) {
      console.error('Error saving mission:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Could not save the mission.',
        buttons: ['OK']
      });
      await alert.present();
    } finally {
      this.saving = false;
    }
  }
}
