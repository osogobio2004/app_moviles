import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemoryViewPage } from './memory-view.page';

const routes: Routes = [
  {
    path: '',
    component: MemoryViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemoryViewPageRoutingModule {}
