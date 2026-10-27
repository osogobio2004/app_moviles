import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatusListPage } from './status-list.page';

const routes: Routes = [
  {
    path: '',
    component: StatusListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatusListPageRoutingModule {}
