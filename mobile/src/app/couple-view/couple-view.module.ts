import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CoupleViewPageRoutingModule } from './couple-view-routing.module';
import { CoupleViewPage } from './couple-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoupleViewPageRoutingModule
  ],
  declarations: [CoupleViewPage]
})
export class CoupleViewPageModule {}
