import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CoupleListPageRoutingModule } from './couple-list-routing.module';
import { CoupleListPage } from './couple-list.page';
import { CoupleFormPageModule } from '../couple-form/couple-form.module';
import { ToolbarModule } from '../components/toolbar/toolbar.module';
import { PaginacionModule } from '../components/paginacion/paginacion.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoupleListPageRoutingModule,
    CoupleFormPageModule,
    ToolbarModule,
    PaginacionModule
  ],
  declarations: [CoupleListPage]
})
export class CoupleListPageModule {}
