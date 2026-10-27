import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileImagenPage } from './profile-imagen.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileImagenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileImagenPageRoutingModule {}
