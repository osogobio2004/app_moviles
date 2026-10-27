import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { UnlockViewPageRoutingModule } from './unlock-view-routing.module';
import { UnlockViewPage } from './unlock-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UnlockViewPageRoutingModule
  ],
  declarations: [UnlockViewPage]
})
export class UnlockViewPageModule {}
