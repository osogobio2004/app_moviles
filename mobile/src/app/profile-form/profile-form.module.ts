import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ProfileFormPageRoutingModule } from './profile-form-routing.module';
import { ProfileFormPage } from './profile-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProfileFormPageRoutingModule
  ],
  declarations: [ProfileFormPage],
  exports: [ProfileFormPage]
})
export class ProfileFormPageModule {}
