import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { UnlockListPageRoutingModule } from './unlock-list-routing.module';
import { UnlockListPage } from './unlock-list.page';
import { UnlockFormPageModule } from '../unlock-form/unlock-form.module';
import { ToolbarModule } from '../components/toolbar/toolbar.module';
import { PaginacionModule } from '../components/paginacion/paginacion.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UnlockListPageRoutingModule,
    UnlockFormPageModule,
    ToolbarModule,
    PaginacionModule
  ],
  declarations: [UnlockListPage]
})
export class UnlockListPageModule {}
