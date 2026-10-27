import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { RewardListPageRoutingModule } from './reward-list-routing.module';
import { RewardListPage } from './reward-list.page';
import { RewardFormPageModule } from '../reward-form/reward-form.module';
import { ToolbarModule } from '../components/toolbar/toolbar.module';
import { PaginacionModule } from '../components/paginacion/paginacion.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RewardListPageRoutingModule,
    RewardFormPageModule,
    ToolbarModule,
    PaginacionModule
  ],
  declarations: [RewardListPage]
})
export class RewardListPageModule {}
