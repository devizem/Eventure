import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { EventsModule } from './events/events.module';

const routes: Routes = [
  {
    path: 'events',
    loadChildren: () =>
      import('./events/events.module').then((m) => EventsModule),
  },
  {
    path: '',
    redirectTo: 'events',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
