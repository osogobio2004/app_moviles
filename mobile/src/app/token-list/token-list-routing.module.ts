import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TokenListPage } from './token-list.page';

const routes: Routes = [
  {
    path: '',
    component: TokenListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TokenListPageRoutingModule {}
