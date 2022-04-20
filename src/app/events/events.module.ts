import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EventsRoutingModule } from './events-routing.module';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { EventFormComponent } from './event-form/event-form.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [EventListComponent, EventDetailComponent, EventFormComponent],
  imports: [CommonModule, EventsRoutingModule, ReactiveFormsModule, IonicModule],
})
export class EventsModule {}
