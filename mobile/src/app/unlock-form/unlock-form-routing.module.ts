import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnlockFormPage } from './unlock-form.page';

const routes: Routes = [
  {
    path: '',
    component: UnlockFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnlockFormPageRoutingModule {}
