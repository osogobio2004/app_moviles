import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MemoryFormPageRoutingModule } from './memory-form-routing.module';

import { MemoryFormPage } from './memory-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MemoryFormPageRoutingModule
  ],
  declarations: [MemoryFormPage],
  exports: [MemoryFormPage]
})
export class MemoryFormPageModule {}
