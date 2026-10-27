import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { LabelListPageRoutingModule } from './label-list-routing.module';
import { LabelListPage } from './label-list.page';
import { LabelFormPageModule } from '../label-form/label-form.module';
import { ToolbarModule } from '../components/toolbar/toolbar.module';
import { PaginacionModule } from '../components/paginacion/paginacion.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LabelListPageRoutingModule,
    LabelFormPageModule,
    ToolbarModule,
    PaginacionModule
  ],
  declarations: [LabelListPage]
})
export class LabelListPageModule {}
