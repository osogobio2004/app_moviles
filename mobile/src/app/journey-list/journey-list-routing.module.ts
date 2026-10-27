import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JourneyListPage } from './journey-list.page';

const routes: Routes = [
  {
    path: '',
    component: JourneyListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JourneyListPageRoutingModule {}
