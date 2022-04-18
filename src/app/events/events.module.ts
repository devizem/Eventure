import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { EventsRoutingModule } from './events-routing.module';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailComponent } from './event-detail/event-detail.component';

@NgModule({
  declarations: [EventListComponent, EventDetailComponent],
  imports: [CommonModule, EventsRoutingModule, IonicModule],
})
export class EventsModule {}
