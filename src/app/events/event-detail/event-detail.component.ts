import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { delay } from 'rxjs/operators';
import { Eventure } from '../event.model';
import { EventService } from '../shared/services';
import { EventFormComponent } from '../event-form/event-form.component';

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
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.route.params.subscribe({
      next: async (prop: Params) => {
        this.event = await this.eventService.getById(prop.id);
      },
    });
  }

  async editEvent() {
    if (!this.event) return
    const modal = await this.modalCtrl.create({
      component: EventFormComponent,
      componentProps: { event: this.event }
    });

    return await modal.present();
  }

  async deleteEvent() {
    await this.eventService.delete(this.event.id);
    this.router.navigate(['/events']);
  }
}
