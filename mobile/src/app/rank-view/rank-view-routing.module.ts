import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RankViewPage } from './rank-view.page';

const routes: Routes = [
  {
    path: '',
    component: RankViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RankViewPageRoutingModule {}
