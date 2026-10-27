import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JourneyViewPageRoutingModule } from './journey-view-routing.module';

import { JourneyViewPage } from './journey-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JourneyViewPageRoutingModule
  ],
  declarations: [JourneyViewPage]
})
export class JourneyViewPageModule {}
