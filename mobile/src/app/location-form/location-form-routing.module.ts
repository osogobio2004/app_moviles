import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocationFormPage } from './location-form.page';

const routes: Routes = [
  {
    path: '',
    component: LocationFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationFormPageRoutingModule {}
