import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoupleFormPage } from './couple-form.page';

const routes: Routes = [
  {
    path: '',
    component: CoupleFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoupleFormPageRoutingModule {}
