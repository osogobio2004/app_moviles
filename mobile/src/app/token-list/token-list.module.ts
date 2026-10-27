import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TokenListPageRoutingModule } from './token-list-routing.module';
import { TokenListPage } from './token-list.page';
import { TokenFormPageModule } from '../token-form/token-form.module';
import { ToolbarModule } from '../components/toolbar/toolbar.module';
import { PaginacionModule } from '../components/paginacion/paginacion.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TokenListPageRoutingModule,
    TokenFormPageModule,
    ToolbarModule,
    PaginacionModule
  ],
  declarations: [TokenListPage]
})
export class TokenListPageModule {}
