import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Eventure } from '../event.model';
import { EventService } from '../shared/services';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
})
export class EventDetailComponent implements OnInit {
  event: Eventure;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eventService: EventService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe({
      next: async (prop: Params) => {
        this.event = await this.eventService.getById(prop.id);
      },
    });
  }

  async deleteEvent(eventId: string) {
    await this.eventService.delete(eventId);
    this.router.navigate(['/events']);
  }
}
