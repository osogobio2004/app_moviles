import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LabelViewPage } from './label-view.page';

const routes: Routes = [
  {
    path: '',
    component: LabelViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LabelViewPageRoutingModule {}
