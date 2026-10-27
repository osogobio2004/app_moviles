import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CoupleFormPageRoutingModule } from './couple-form-routing.module';
import { CoupleFormPage } from './couple-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CoupleFormPageRoutingModule
  ],
  declarations: [CoupleFormPage],
  exports: [CoupleFormPage]
})
export class CoupleFormPageModule {}
