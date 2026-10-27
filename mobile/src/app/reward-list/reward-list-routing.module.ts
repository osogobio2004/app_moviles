import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RewardListPage } from './reward-list.page';

const routes: Routes = [
  {
    path: '',
    component: RewardListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RewardListPageRoutingModule {}
