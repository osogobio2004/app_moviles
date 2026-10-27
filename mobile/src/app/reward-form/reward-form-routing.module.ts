import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RewardFormPage } from './reward-form.page';

const routes: Routes = [
  {
    path: '',
    component: RewardFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RewardFormPageRoutingModule {}
