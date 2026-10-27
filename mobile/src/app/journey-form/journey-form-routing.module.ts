import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JourneyFormPage } from './journey-form.page';

const routes: Routes = [
  {
    path: '',
    component: JourneyFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JourneyFormPageRoutingModule {}
