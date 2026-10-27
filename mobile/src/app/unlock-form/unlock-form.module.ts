import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { UnlockFormPageRoutingModule } from './unlock-form-routing.module';
import { UnlockFormPage } from './unlock-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    UnlockFormPageRoutingModule
  ],
  declarations: [UnlockFormPage],
  exports: [UnlockFormPage]
})
export class UnlockFormPageModule {}
