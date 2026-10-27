import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { StepFormPageRoutingModule } from './step-form-routing.module';
import { StepFormPage } from './step-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    StepFormPageRoutingModule
  ],
  declarations: [StepFormPage],
  exports: [StepFormPage]
})
export class StepFormPageModule {}
