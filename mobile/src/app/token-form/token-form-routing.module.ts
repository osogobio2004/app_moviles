import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TokenFormPage } from './token-form.page';

const routes: Routes = [
  {
    path: '',
    component: TokenFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TokenFormPageRoutingModule {}
