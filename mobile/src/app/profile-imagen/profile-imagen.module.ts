import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProfileImagenPageRoutingModule } from './profile-imagen-routing.module';
import { ProfileImagenPage } from './profile-imagen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileImagenPageRoutingModule
  ],
  declarations: [ProfileImagenPage]
})
export class ProfileImagenPageModule {}
