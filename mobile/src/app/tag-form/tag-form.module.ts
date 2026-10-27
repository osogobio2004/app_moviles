import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TagFormPageRoutingModule } from './tag-form-routing.module';
import { TagFormPage } from './tag-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TagFormPageRoutingModule
  ],
  declarations: [TagFormPage],
  exports: [TagFormPage]
})
export class TagFormPageModule {}
