import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JourneyFormPageRoutingModule } from './journey-form-routing.module';

import { JourneyFormPage } from './journey-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    JourneyFormPageRoutingModule
  ],
  declarations: [JourneyFormPage],
  exports: [JourneyFormPage]
})
export class JourneyFormPageModule {}
