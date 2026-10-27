import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryViewPage } from './inventory-view.page';

const routes: Routes = [
  {
    path: '',
    component: InventoryViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryViewPageRoutingModule {}
