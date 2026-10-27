import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MissionListPageRoutingModule } from './mission-list-routing.module';

import { MissionListPage } from './mission-list.page';
import { MissionFormPageModule } from '../mission-form/mission-form.module';
import { ToolbarModule } from '../components/toolbar/toolbar.module';
import { PaginacionModule } from '../components/paginacion/paginacion.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MissionListPageRoutingModule,
    MissionFormPageModule,
    ToolbarModule,
    PaginacionModule
  ],
  declarations: [MissionListPage]
})
export class MissionListPageModule {}
