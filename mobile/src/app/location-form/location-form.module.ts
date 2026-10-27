import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { LocationFormPageRoutingModule } from './location-form-routing.module';
import { LocationFormPage } from './location-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LocationFormPageRoutingModule
  ],
  declarations: [LocationFormPage],
  exports: [LocationFormPage]
})
export class LocationFormPageModule {}
