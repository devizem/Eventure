import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EventsRoutingModule } from './events-routing.module';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { HeadingComponent } from './shared/components/heading/heading.component';
import { CardCarouselComponent } from './shared/components/card-carousel/card-carousel.component';
import { CardComponent } from './shared/components/card/card.component';
import { SwiperModule } from 'swiper/angular';
import { IonicModule } from '@ionic/angular';
import { EventFormComponent } from './event-form/event-form.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    EventListComponent,
    EventDetailComponent,
    EventFormComponent,
    HeadingComponent,
    CardCarouselComponent,
    CardComponent,
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    IonicModule,
    SwiperModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class EventsModule {}
