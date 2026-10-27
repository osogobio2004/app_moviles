import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TokenViewPageRoutingModule } from './token-view-routing.module';
import { TokenViewPage } from './token-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TokenViewPageRoutingModule
  ],
  declarations: [TokenViewPage]
})
export class TokenViewPageModule {}
