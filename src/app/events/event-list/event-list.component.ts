import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { EventService } from '../shared/services';
import { Eventure } from '../event.model';
import { ModalController } from '@ionic/angular';
import { EventFormComponent } from '../event-form/event-form.component';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit {
  events$: Observable<Eventure[]>;
  categories = ['Religious Event', 'Fair', 'Dancing'];
  tags = ['blueberry', 'beer', 'wildlife', 'saint'];
  tagsArray = []; //temp name

  constructor(
    private eventService: EventService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.events$ = this.eventService.data$;
  }

  selectCategory(category) {
    this.eventService.filterByCategory(category);
  }

  selectTag(tag: string): void {
    if (this.tagsArray.includes(tag)) {
      this.tagsArray.splice(this.tagsArray.indexOf(tag), 1);
    } else {
      this.tagsArray.push(tag);
    }

    this.eventService.filterByTags(this.tagsArray);
  }

  async createEvent() {
    const modal = await this.modalCtrl.create({
      component: EventFormComponent,
    });

    await modal.present();
  }
}
