import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemoryListPage } from './memory-list.page';

const routes: Routes = [
  {
    path: '',
    component: MemoryListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemoryListPageRoutingModule {}
