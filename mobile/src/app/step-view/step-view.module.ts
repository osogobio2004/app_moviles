import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { StepViewPageRoutingModule } from './step-view-routing.module';
import { StepViewPage } from './step-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StepViewPageRoutingModule
  ],
  declarations: [StepViewPage]
})
export class StepViewPageModule {}
