import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StepViewPage } from './step-view.page';

const routes: Routes = [
  {
    path: '',
    component: StepViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepViewPageRoutingModule {}
