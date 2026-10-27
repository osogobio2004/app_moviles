import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImagesImagenPage } from './images-imagen.page';

const routes: Routes = [
  {
    path: '',
    component: ImagesImagenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImagesImagenPageRoutingModule {}
