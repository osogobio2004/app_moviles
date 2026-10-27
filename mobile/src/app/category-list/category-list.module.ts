import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CategoryListPageRoutingModule } from './category-list-routing.module';
import { CategoryListPage } from './category-list.page';
import { CategoryFormPageModule } from '../category-form/category-form.module';
import { ToolbarModule } from '../components/toolbar/toolbar.module';
import { PaginacionModule } from '../components/paginacion/paginacion.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoryListPageRoutingModule,
    CategoryFormPageModule,
    ToolbarModule,
    PaginacionModule
  ],
  declarations: [CategoryListPage]
})
export class CategoryListPageModule {}
