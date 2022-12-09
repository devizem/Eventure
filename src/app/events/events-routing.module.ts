import { NgModule } from '@angular/core';
import { firebaseApp$ } from '@angular/fire/app';
import { RouterModule, Routes } from '@angular/router';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { EventListComponent } from './event-list/event-list.component';

const routes: Routes = [
  { path: '', component: EventListComponent },
  { path: 'detail/:id', component: EventDetailComponent },
  {
    path: 'detail/:id/instagram',
    component: EventDetailComponent,
    data: { instagram: 'true' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsRoutingModule {}
