import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ImagesFormPageRoutingModule } from './images-form-routing.module';
import { ImagesFormPage } from './images-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ImagesFormPageRoutingModule
  ],
  declarations: [ImagesFormPage],
  exports: [ImagesFormPage]
})
export class ImagesFormPageModule {}
