import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RewardViewPageRoutingModule } from './reward-view-routing.module';

import { RewardViewPage } from './reward-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RewardViewPageRoutingModule
  ],
  declarations: [RewardViewPage]
})
export class RewardViewPageModule {}
