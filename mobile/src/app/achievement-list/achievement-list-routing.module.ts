import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AchievementListPage } from './achievement-list.page';

const routes: Routes = [
  {
    path: '',
    component: AchievementListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AchievementListPageRoutingModule {}
