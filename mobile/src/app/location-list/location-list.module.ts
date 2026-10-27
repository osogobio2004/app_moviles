import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { LocationListPageRoutingModule } from './location-list-routing.module';
import { LocationListPage } from './location-list.page';
import { LocationFormPageModule } from '../location-form/location-form.module';
import { ToolbarModule } from '../components/toolbar/toolbar.module';
import { PaginacionModule } from '../components/paginacion/paginacion.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocationListPageRoutingModule,
    LocationFormPageModule,
    ToolbarModule,
    PaginacionModule
  ],
  declarations: [LocationListPage]
})
export class LocationListPageModule {}
