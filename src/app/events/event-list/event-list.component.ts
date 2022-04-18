import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { EventService } from '../shared/services';
import { Eventure } from '../event.model';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit {
  events$: Observable<Eventure[]>;

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.events$ = this.eventService.data$;
  }
}
