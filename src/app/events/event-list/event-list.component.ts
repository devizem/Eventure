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
  tags = ['berry', 'beer', 'desert', 'wildlife', 'saint'];
  selectedTags = [];

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

  tagSearch(searchInput: string) {
    this.eventService.filterByTags(searchInput);
  }

  selectTag(tag: string): void {
    if (this.selectedTags.includes(tag)) {
      this.selectedTags.splice(this.selectedTags.indexOf(tag), 1);
    } else {
      this.selectedTags.push(tag);
    }
    this.eventService.filterByTags(this.selectedTags);
  }

  async createEvent() {
    const modal = await this.modalCtrl.create({
      component: EventFormComponent,
    });

    await modal.present();
  }
}
