import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MemoryViewPageRoutingModule } from './memory-view-routing.module';

import { MemoryViewPage } from './memory-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MemoryViewPageRoutingModule
  ],
  declarations: [MemoryViewPage]
})
export class MemoryViewPageModule {}
