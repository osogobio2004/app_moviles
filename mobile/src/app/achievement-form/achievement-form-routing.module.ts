import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AchievementFormPage } from './achievement-form.page';

const routes: Routes = [
  {
    path: '',
    component: AchievementFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AchievementFormPageRoutingModule {}
