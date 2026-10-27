import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AchievementViewPageRoutingModule } from './achievement-view-routing.module';
import { AchievementViewPage } from './achievement-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AchievementViewPageRoutingModule
  ],
  declarations: [AchievementViewPage]
})
export class AchievementViewPageModule {}
