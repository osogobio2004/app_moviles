import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImagesListPage } from './images-list.page';

const routes: Routes = [
  {
    path: '',
    component: ImagesListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImagesListPageRoutingModule {}
