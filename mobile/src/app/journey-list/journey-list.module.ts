import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JourneyListPageRoutingModule } from './journey-list-routing.module';

import { JourneyListPage } from './journey-list.page';
import { JourneyFormPageModule } from '../journey-form/journey-form.module';
import { ToolbarModule } from '../components/toolbar/toolbar.module';
import { PaginacionModule } from '../components/paginacion/paginacion.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JourneyListPageRoutingModule,
    JourneyFormPageModule,
    ToolbarModule,
    PaginacionModule
  ],
  declarations: [JourneyListPage]
})
export class JourneyListPageModule {}
