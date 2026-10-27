import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JourneyViewPage } from './journey-view.page';

const routes: Routes = [
  {
    path: '',
    component: JourneyViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JourneyViewPageRoutingModule {}
