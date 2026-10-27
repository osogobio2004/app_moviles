import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MemoryListPageRoutingModule } from './memory-list-routing.module';

import { MemoryListPage } from './memory-list.page';
import { MemoryFormPageModule } from '../memory-form/memory-form.module';
import { ToolbarModule } from '../components/toolbar/toolbar.module';
import { PaginacionModule } from '../components/paginacion/paginacion.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MemoryListPageRoutingModule,
    MemoryFormPageModule,
    ToolbarModule,
    PaginacionModule
  ],
  declarations: [MemoryListPage]
})
export class MemoryListPageModule {}
