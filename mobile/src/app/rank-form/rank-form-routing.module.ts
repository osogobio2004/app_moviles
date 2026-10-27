import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RankFormPage } from './rank-form.page';

const routes: Routes = [
  {
    path: '',
    component: RankFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RankFormPageRoutingModule {}
