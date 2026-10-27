import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RankListPage } from './rank-list.page';

const routes: Routes = [
  {
    path: '',
    component: RankListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RankListPageRoutingModule {}
