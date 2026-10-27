import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TokenFormPageRoutingModule } from './token-form-routing.module';
import { TokenFormPage } from './token-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TokenFormPageRoutingModule
  ],
  declarations: [TokenFormPage],
  exports: [TokenFormPage]
})
export class TokenFormPageModule {}
