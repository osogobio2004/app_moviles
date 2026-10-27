import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnlockViewPage } from './unlock-view.page';

const routes: Routes = [
  {
    path: '',
    component: UnlockViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnlockViewPageRoutingModule {}
