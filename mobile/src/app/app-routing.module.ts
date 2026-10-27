import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';
import { COLECCIONES } from './catalogos/colecciones.config';

const routes: Routes = [
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
  { path: 'registro', loadChildren: () => import('./registro/registro.module').then(m => m.RegistroPageModule) },
  { path: 'tabs', canActivate: [authGuard], loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule) },
  { path: 'catalogos', canActivate: [authGuard], canActivateChild: [authGuard], children: [
    ...COLECCIONES.filter(c => c.tabla !== 'pedidos').reduce<Routes>((rutas, c) => [...rutas,
      { path: c.ruta + '/formulario/:id', redirectTo: '/tabs/catalogos/' + c.ruta + '/formulario/:id', pathMatch: 'full' },
      { path: c.ruta + '/formulario', redirectTo: '/tabs/catalogos/' + c.ruta + '/formulario', pathMatch: 'full' },
      { path: c.ruta + '/detalle/:id', redirectTo: '/tabs/catalogos/' + c.ruta + '/detalle/:id', pathMatch: 'full' },
      { path: c.ruta, redirectTo: '/tabs/catalogos/' + c.ruta, pathMatch: 'full' }
    ], []),
    { path: '', redirectTo: '/tabs/resumen', pathMatch: 'full' }
  ] },
  { path: 'productos-list', redirectTo: 'tabs/productos', pathMatch: 'full' },
  { path: 'productos-view/:id', redirectTo: 'tabs/productos/detalle/:id', pathMatch: 'full' },
  { path: 'productos-form/:id', redirectTo: 'tabs/productos/formulario/:id', pathMatch: 'full' },
  { path: 'productos-form', redirectTo: 'tabs/productos/formulario', pathMatch: 'full' },
  { path: 'producto-imagen/:id', redirectTo: 'tabs/productos/imagen/:id', pathMatch: 'full' },
  { path: 'ejemplos-campos', canActivate: [authGuard], loadChildren: () => import('./ejemplos-campos/ejemplos-campos.module').then(m => m.EjemplosCamposPageModule) },

  // Rutas de las entidades originales del proyecto
  { path: 'mission-list', canActivate: [authGuard], loadChildren: () => import('./mission-list/mission-list.module').then(m => m.MissionListPageModule) },
  { path: 'mission-form', canActivate: [authGuard], loadChildren: () => import('./mission-form/mission-form.module').then(m => m.MissionFormPageModule) },
  { path: 'mission-view/:id', canActivate: [authGuard], loadChildren: () => import('./mission-view/mission-view.module').then(m => m.MissionViewPageModule) },
  { path: 'journey-list', canActivate: [authGuard], loadChildren: () => import('./journey-list/journey-list.module').then(m => m.JourneyListPageModule) },
  { path: 'journey-form', canActivate: [authGuard], loadChildren: () => import('./journey-form/journey-form.module').then(m => m.JourneyFormPageModule) },
  { path: 'journey-view/:id', canActivate: [authGuard], loadChildren: () => import('./journey-view/journey-view.module').then(m => m.JourneyViewPageModule) },
  { path: 'memory-list', canActivate: [authGuard], loadChildren: () => import('./memory-list/memory-list.module').then(m => m.MemoryListPageModule) },
  { path: 'memory-form', canActivate: [authGuard], loadChildren: () => import('./memory-form/memory-form.module').then(m => m.MemoryFormPageModule) },
  { path: 'memory-view/:id', canActivate: [authGuard], loadChildren: () => import('./memory-view/memory-view.module').then(m => m.MemoryViewPageModule) },
  { path: 'reward-list', canActivate: [authGuard], loadChildren: () => import('./reward-list/reward-list.module').then(m => m.RewardListPageModule) },
  { path: 'reward-form', canActivate: [authGuard], loadChildren: () => import('./reward-form/reward-form.module').then(m => m.RewardFormPageModule) },
  { path: 'reward-view/:id', canActivate: [authGuard], loadChildren: () => import('./reward-view/reward-view.module').then(m => m.RewardViewPageModule) },
  { path: 'achievement-list', canActivate: [authGuard], loadChildren: () => import('./achievement-list/achievement-list.module').then(m => m.AchievementListPageModule) },
  { path: 'achievement-form', canActivate: [authGuard], loadChildren: () => import('./achievement-form/achievement-form.module').then(m => m.AchievementFormPageModule) },
  { path: 'achievement-view/:id', canActivate: [authGuard], loadChildren: () => import('./achievement-view/achievement-view.module').then(m => m.AchievementViewPageModule) },
  { path: 'profile-list', canActivate: [authGuard], loadChildren: () => import('./profile-list/profile-list.module').then(m => m.ProfileListPageModule) },
  { path: 'profile-form', canActivate: [authGuard], loadChildren: () => import('./profile-form/profile-form.module').then(m => m.ProfileFormPageModule) },
  { path: 'profile-view/:id', canActivate: [authGuard], loadChildren: () => import('./profile-view/profile-view.module').then(m => m.ProfileViewPageModule) },
  { path: 'profile-imagen/:id', canActivate: [authGuard], loadChildren: () => import('./profile-imagen/profile-imagen.module').then(m => m.ProfileImagenPageModule) },
  { path: 'category-list', canActivate: [authGuard], loadChildren: () => import('./category-list/category-list.module').then(m => m.CategoryListPageModule) },
  { path: 'category-form', canActivate: [authGuard], loadChildren: () => import('./category-form/category-form.module').then(m => m.CategoryFormPageModule) },
  { path: 'category-view/:id', canActivate: [authGuard], loadChildren: () => import('./category-view/category-view.module').then(m => m.CategoryViewPageModule) },
  { path: 'status-list', canActivate: [authGuard], loadChildren: () => import('./status-list/status-list.module').then(m => m.StatusListPageModule) },
  { path: 'status-form', canActivate: [authGuard], loadChildren: () => import('./status-form/status-form.module').then(m => m.StatusFormPageModule) },
  { path: 'status-view/:id', canActivate: [authGuard], loadChildren: () => import('./status-view/status-view.module').then(m => m.StatusViewPageModule) },
  { path: 'couple-list', canActivate: [authGuard], loadChildren: () => import('./couple-list/couple-list.module').then(m => m.CoupleListPageModule) },
  { path: 'couple-form', canActivate: [authGuard], loadChildren: () => import('./couple-form/couple-form.module').then(m => m.CoupleFormPageModule) },
  { path: 'couple-view/:id', canActivate: [authGuard], loadChildren: () => import('./couple-view/couple-view.module').then(m => m.CoupleViewPageModule) },
  { path: 'rank-list', canActivate: [authGuard], loadChildren: () => import('./rank-list/rank-list.module').then(m => m.RankListPageModule) },
  { path: 'rank-form', canActivate: [authGuard], loadChildren: () => import('./rank-form/rank-form.module').then(m => m.RankFormPageModule) },
  { path: 'rank-view/:id', canActivate: [authGuard], loadChildren: () => import('./rank-view/rank-view.module').then(m => m.RankViewPageModule) },
  { path: 'tag-list', canActivate: [authGuard], loadChildren: () => import('./tag-list/tag-list.module').then(m => m.TagListPageModule) },
  { path: 'tag-form', canActivate: [authGuard], loadChildren: () => import('./tag-form/tag-form.module').then(m => m.TagFormPageModule) },
  { path: 'tag-view/:id', canActivate: [authGuard], loadChildren: () => import('./tag-view/tag-view.module').then(m => m.TagViewPageModule) },
  { path: 'step-list', canActivate: [authGuard], loadChildren: () => import('./step-list/step-list.module').then(m => m.StepListPageModule) },
  { path: 'step-form', canActivate: [authGuard], loadChildren: () => import('./step-form/step-form.module').then(m => m.StepFormPageModule) },
  { path: 'step-view/:id', canActivate: [authGuard], loadChildren: () => import('./step-view/step-view.module').then(m => m.StepViewPageModule) },
  { path: 'location-list', canActivate: [authGuard], loadChildren: () => import('./location-list/location-list.module').then(m => m.LocationListPageModule) },
  { path: 'location-form', canActivate: [authGuard], loadChildren: () => import('./location-form/location-form.module').then(m => m.LocationFormPageModule) },
  { path: 'location-view/:id', canActivate: [authGuard], loadChildren: () => import('./location-view/location-view.module').then(m => m.LocationViewPageModule) },
  { path: 'label-list', canActivate: [authGuard], loadChildren: () => import('./label-list/label-list.module').then(m => m.LabelListPageModule) },
  { path: 'label-form', canActivate: [authGuard], loadChildren: () => import('./label-form/label-form.module').then(m => m.LabelFormPageModule) },
  { path: 'label-view/:id', canActivate: [authGuard], loadChildren: () => import('./label-view/label-view.module').then(m => m.LabelViewPageModule) },
  { path: 'unlock-list', canActivate: [authGuard], loadChildren: () => import('./unlock-list/unlock-list.module').then(m => m.UnlockListPageModule) },
  { path: 'unlock-form', canActivate: [authGuard], loadChildren: () => import('./unlock-form/unlock-form.module').then(m => m.UnlockFormPageModule) },
  { path: 'unlock-view/:id', canActivate: [authGuard], loadChildren: () => import('./unlock-view/unlock-view.module').then(m => m.UnlockViewPageModule) },
  { path: 'inventory-list', canActivate: [authGuard], loadChildren: () => import('./inventory-list/inventory-list.module').then(m => m.InventoryListPageModule) },
  { path: 'inventory-form', canActivate: [authGuard], loadChildren: () => import('./inventory-form/inventory-form.module').then(m => m.InventoryFormPageModule) },
  { path: 'inventory-view/:id', canActivate: [authGuard], loadChildren: () => import('./inventory-view/inventory-view.module').then(m => m.InventoryViewPageModule) },
  { path: 'token-list', canActivate: [authGuard], loadChildren: () => import('./token-list/token-list.module').then(m => m.TokenListPageModule) },
  { path: 'token-form', canActivate: [authGuard], loadChildren: () => import('./token-form/token-form.module').then(m => m.TokenFormPageModule) },
  { path: 'token-view/:id', canActivate: [authGuard], loadChildren: () => import('./token-view/token-view.module').then(m => m.TokenViewPageModule) },
  { path: 'images-list', canActivate: [authGuard], loadChildren: () => import('./images-list/images-list.module').then(m => m.ImagesListPageModule) },
  { path: 'images-form', canActivate: [authGuard], loadChildren: () => import('./images-form/images-form.module').then(m => m.ImagesFormPageModule) },
  { path: 'images-view/:id', canActivate: [authGuard], loadChildren: () => import('./images-view/images-view.module').then(m => m.ImagesViewPageModule) },
  { path: 'images-imagen/:id', canActivate: [authGuard], loadChildren: () => import('./images-imagen/images-imagen.module').then(m => m.ImagesImagenPageModule) },

  { path: '', redirectTo: 'tabs/productos', pathMatch: 'full' },
  { path: '**', redirectTo: 'tabs/productos' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
