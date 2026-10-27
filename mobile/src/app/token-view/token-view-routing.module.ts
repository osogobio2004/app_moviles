import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TokenViewPage } from './token-view.page';

const routes: Routes = [
  {
    path: '',
    component: TokenViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TokenViewPageRoutingModule {}
