import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { StatusViewPageRoutingModule } from './status-view-routing.module';
import { StatusViewPage } from './status-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StatusViewPageRoutingModule
  ],
  declarations: [StatusViewPage]
})
export class StatusViewPageModule {}
