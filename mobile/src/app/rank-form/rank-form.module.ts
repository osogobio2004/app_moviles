import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { RankFormPageRoutingModule } from './rank-form-routing.module';
import { RankFormPage } from './rank-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RankFormPageRoutingModule
  ],
  declarations: [RankFormPage],
  exports: [RankFormPage]
})
export class RankFormPageModule {}
