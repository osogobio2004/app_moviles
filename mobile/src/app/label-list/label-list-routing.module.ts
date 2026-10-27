import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LabelListPage } from './label-list.page';

const routes: Routes = [
  {
    path: '',
    component: LabelListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LabelListPageRoutingModule {}
