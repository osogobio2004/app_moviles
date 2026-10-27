import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ImagesImagenPageRoutingModule } from './images-imagen-routing.module';
import { ImagesImagenPage } from './images-imagen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImagesImagenPageRoutingModule
  ],
  declarations: [ImagesImagenPage]
})
export class ImagesImagenPageModule {}
