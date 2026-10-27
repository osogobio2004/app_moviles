import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RewardFormPageRoutingModule } from './reward-form-routing.module';

import { RewardFormPage } from './reward-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RewardFormPageRoutingModule
  ],
  declarations: [RewardFormPage],
  exports: [RewardFormPage]
})
export class RewardFormPageModule {}
