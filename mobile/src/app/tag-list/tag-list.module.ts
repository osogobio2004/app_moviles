import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TagListPageRoutingModule } from './tag-list-routing.module';
import { TagListPage } from './tag-list.page';
import { TagFormPageModule } from '../tag-form/tag-form.module';
import { ToolbarModule } from '../components/toolbar/toolbar.module';
import { PaginacionModule } from '../components/paginacion/paginacion.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TagListPageRoutingModule,
    TagFormPageModule,
    ToolbarModule,
    PaginacionModule
  ],
  declarations: [TagListPage]
})
export class TagListPageModule {}
