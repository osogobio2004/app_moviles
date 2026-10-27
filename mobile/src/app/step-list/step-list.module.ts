import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { StepListPageRoutingModule } from './step-list-routing.module';
import { StepListPage } from './step-list.page';
import { StepFormPageModule } from '../step-form/step-form.module';
import { ToolbarModule } from '../components/toolbar/toolbar.module';
import { PaginacionModule } from '../components/paginacion/paginacion.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StepListPageRoutingModule,
    StepFormPageModule,
    ToolbarModule,
    PaginacionModule
  ],
  declarations: [StepListPage]
})
export class StepListPageModule {}
