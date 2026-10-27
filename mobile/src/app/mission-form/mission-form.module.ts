import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MissionFormPageRoutingModule } from './mission-form-routing.module';

import { MissionFormPage } from './mission-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MissionFormPageRoutingModule
  ],
  declarations: [MissionFormPage]
})
export class MissionFormPageModule {}
