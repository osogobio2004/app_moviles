import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { LocationViewPageRoutingModule } from './location-view-routing.module';
import { LocationViewPage } from './location-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocationViewPageRoutingModule
  ],
  declarations: [LocationViewPage]
})
export class LocationViewPageModule {}
