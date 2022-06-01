import { Component, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { delay, tap } from 'rxjs/operators';
import { Eventure } from '../event.model';
import { EventService } from '../shared/services';
import { EventFormComponent } from '../event-form/event-form.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
})
export class EventDetailComponent implements OnInit {
  event$: Observable<Eventure>;
  event: Eventure;
  hostEl: HTMLElement;

  constructor(
    private element: ElementRef,
    private router: Router,
    private route: ActivatedRoute,
    private eventService: EventService,
    private modalCtrl: ModalController
  ) {
    this.hostEl = this.element.nativeElement;
  }

  ngOnInit() {
    this.route.params.subscribe({
      next: (prop: Params) => {
        this.event$ = this.eventService.getById(prop.id).pipe(
          tap((res) => {
            this.event = res;
            this.hostEl.style.setProperty(
              '--background-image',
              `url(${res.picture})`
            );
          })
        );
      },
    });
  }

  onScroll(event) {
    const hostHeight = this.hostEl.clientHeight;
    const opacity = (event.detail.scrollTop * 1) / (hostHeight / 2.5);
    this.hostEl.style.setProperty(
      '--dynamic-opacity',
      opacity > 0.85 ? '0.85' : opacity.toString()
    );
  }

  async editEvent() {
    if (!this.event) {
      return;
    }
    const modal = await this.modalCtrl.create({
      component: EventFormComponent,
      componentProps: { event: this.event },
    });

    return await modal.present();
  }

  async deleteEvent() {
    await this.eventService.delete(this.event.id);
    this.router.navigate(['/events']);
  }
}
