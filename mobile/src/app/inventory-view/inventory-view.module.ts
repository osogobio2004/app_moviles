import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { InventoryViewPageRoutingModule } from './inventory-view-routing.module';
import { InventoryViewPage } from './inventory-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventoryViewPageRoutingModule
  ],
  declarations: [InventoryViewPage]
})
export class InventoryViewPageModule {}
