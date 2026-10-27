import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { LabelFormPageRoutingModule } from './label-form-routing.module';
import { LabelFormPage } from './label-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LabelFormPageRoutingModule
  ],
  declarations: [LabelFormPage],
  exports: [LabelFormPage]
})
export class LabelFormPageModule {}
