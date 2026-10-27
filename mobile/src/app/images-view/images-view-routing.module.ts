import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImagesViewPage } from './images-view.page';

const routes: Routes = [
  {
    path: '',
    component: ImagesViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImagesViewPageRoutingModule {}
