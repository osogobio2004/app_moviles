import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MissionListPage } from './mission-list.page';


const routes: Routes = [
  {
    path: '',
    component: MissionListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MissionListPageRoutingModule {}
