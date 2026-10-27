import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImagesFormPage } from './images-form.page';

const routes: Routes = [
  {
    path: '',
    component: ImagesFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImagesFormPageRoutingModule {}
