import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { RankViewPageRoutingModule } from './rank-view-routing.module';
import { RankViewPage } from './rank-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RankViewPageRoutingModule
  ],
  declarations: [RankViewPage]
})
export class RankViewPageModule {}
