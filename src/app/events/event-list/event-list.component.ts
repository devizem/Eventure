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

  constructor(
    private eventService: EventService, 
    private modalCtrl: ModalController
    ) {}

  ngOnInit() {
    this.events$ = this.eventService.data$;
  }

  async createEvent() {
    const modal = await this.modalCtrl.create({
      component: EventFormComponent,
    });
  
    await modal.present();
  }
}
