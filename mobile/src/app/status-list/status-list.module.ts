import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { StatusListPageRoutingModule } from './status-list-routing.module';
import { StatusListPage } from './status-list.page';
import { StatusFormPageModule } from '../status-form/status-form.module';
import { ToolbarModule } from '../components/toolbar/toolbar.module';
import { PaginacionModule } from '../components/paginacion/paginacion.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StatusListPageRoutingModule,
    StatusFormPageModule,
    ToolbarModule,
    PaginacionModule
  ],
  declarations: [StatusListPage]
})
export class StatusListPageModule {}
