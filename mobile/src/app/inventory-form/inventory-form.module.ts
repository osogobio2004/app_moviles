import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { InventoryFormPageRoutingModule } from './inventory-form-routing.module';
import { InventoryFormPage } from './inventory-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    InventoryFormPageRoutingModule
  ],
  declarations: [InventoryFormPage],
  exports: [InventoryFormPage]
})
export class InventoryFormPageModule {}
