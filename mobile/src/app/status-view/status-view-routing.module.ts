import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatusViewPage } from './status-view.page';

const routes: Routes = [
  {
    path: '',
    component: StatusViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatusViewPageRoutingModule {}
