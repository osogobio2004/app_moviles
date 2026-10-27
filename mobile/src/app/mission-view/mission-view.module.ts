import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MissionViewPageRoutingModule } from './mission-view-routing.module';

import { MissionViewPage } from './mission-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MissionViewPageRoutingModule
  ],
  declarations: [MissionViewPage]
})
export class MissionViewPageModule {}
