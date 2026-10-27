import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TagViewPageRoutingModule } from './tag-view-routing.module';
import { TagViewPage } from './tag-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TagViewPageRoutingModule
  ],
  declarations: [TagViewPage]
})
export class TagViewPageModule {}
