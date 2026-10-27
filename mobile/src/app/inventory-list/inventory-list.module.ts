import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { InventoryListPageRoutingModule } from './inventory-list-routing.module';
import { InventoryListPage } from './inventory-list.page';
import { InventoryFormPageModule } from '../inventory-form/inventory-form.module';
import { ToolbarModule } from '../components/toolbar/toolbar.module';
import { PaginacionModule } from '../components/paginacion/paginacion.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventoryListPageRoutingModule,
    InventoryFormPageModule,
    ToolbarModule,
    PaginacionModule
  ],
  declarations: [InventoryListPage]
})
export class InventoryListPageModule {}
