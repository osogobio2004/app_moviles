import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatusFormPage } from './status-form.page';

const routes: Routes = [
  {
    path: '',
    component: StatusFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatusFormPageRoutingModule {}
