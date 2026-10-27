import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { LabelViewPageRoutingModule } from './label-view-routing.module';
import { LabelViewPage } from './label-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LabelViewPageRoutingModule
  ],
  declarations: [LabelViewPage]
})
export class LabelViewPageModule {}
