import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { StatusFormPageRoutingModule } from './status-form-routing.module';
import { StatusFormPage } from './status-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    StatusFormPageRoutingModule
  ],
  declarations: [StatusFormPage],
  exports: [StatusFormPage]
})
export class StatusFormPageModule {}
