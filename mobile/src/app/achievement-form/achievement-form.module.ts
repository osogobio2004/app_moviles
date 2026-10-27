import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AchievementFormPageRoutingModule } from './achievement-form-routing.module';
import { AchievementFormPage } from './achievement-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AchievementFormPageRoutingModule
  ],
  declarations: [AchievementFormPage],
  exports: [AchievementFormPage]
})
export class AchievementFormPageModule {}
