import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ImagesListPageRoutingModule } from './images-list-routing.module';
import { ImagesListPage } from './images-list.page';
import { ImagesFormPageModule } from '../images-form/images-form.module';
import { ToolbarModule } from '../components/toolbar/toolbar.module';
import { PaginacionModule } from '../components/paginacion/paginacion.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImagesListPageRoutingModule,
    ImagesFormPageModule,
    ToolbarModule,
    PaginacionModule
  ],
  declarations: [ImagesListPage]
})
export class ImagesListPageModule {}
