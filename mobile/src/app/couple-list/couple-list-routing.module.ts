import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoupleListPage } from './couple-list.page';

const routes: Routes = [
  {
    path: '',
    component: CoupleListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoupleListPageRoutingModule {}
