import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MissionFormPage } from './mission-form.page';

const routes: Routes = [
  {
    path: '',
    component: MissionFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MissionFormPageRoutingModule {}
