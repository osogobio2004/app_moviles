import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnlockListPage } from './unlock-list.page';

const routes: Routes = [
  {
    path: '',
    component: UnlockListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnlockListPageRoutingModule {}
