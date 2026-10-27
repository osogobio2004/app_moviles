import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocationViewPage } from './location-view.page';

const routes: Routes = [
  {
    path: '',
    component: LocationViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationViewPageRoutingModule {}
