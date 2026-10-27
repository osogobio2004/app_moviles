import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AchievementListPageRoutingModule } from './achievement-list-routing.module';
import { AchievementListPage } from './achievement-list.page';
import { AchievementFormPageModule } from '../achievement-form/achievement-form.module';
import { ToolbarModule } from '../components/toolbar/toolbar.module';
import { PaginacionModule } from '../components/paginacion/paginacion.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AchievementListPageRoutingModule,
    AchievementFormPageModule,
    ToolbarModule,
    PaginacionModule
  ],
  declarations: [AchievementListPage]
})
export class AchievementListPageModule {}
