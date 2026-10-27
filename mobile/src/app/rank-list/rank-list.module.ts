import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { RankListPageRoutingModule } from './rank-list-routing.module';
import { RankListPage } from './rank-list.page';
import { RankFormPageModule } from '../rank-form/rank-form.module';
import { ToolbarModule } from '../components/toolbar/toolbar.module';
import { PaginacionModule } from '../components/paginacion/paginacion.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RankListPageRoutingModule,
    RankFormPageModule,
    ToolbarModule,
    PaginacionModule
  ],
  declarations: [RankListPage]
})
export class RankListPageModule {}
