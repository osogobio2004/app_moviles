import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoupleViewPage } from './couple-view.page';

const routes: Routes = [
  {
    path: '',
    component: CoupleViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoupleViewPageRoutingModule {}
