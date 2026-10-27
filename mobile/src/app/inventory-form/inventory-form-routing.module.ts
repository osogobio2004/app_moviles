import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryFormPage } from './inventory-form.page';

const routes: Routes = [
  {
    path: '',
    component: InventoryFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryFormPageRoutingModule {}
