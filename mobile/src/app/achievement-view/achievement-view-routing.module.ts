import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AchievementViewPage } from './achievement-view.page';

const routes: Routes = [
  {
    path: '',
    component: AchievementViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AchievementViewPageRoutingModule {}
