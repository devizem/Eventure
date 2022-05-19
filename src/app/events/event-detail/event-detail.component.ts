import { Component, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { delay, tap } from 'rxjs/operators';
import { Eventure } from '../event.model';
import { EventService } from '../shared/services';
import { EventFormComponent } from '../event-form/event-form.component';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

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
    private modalCtrl: ModalController,
    private translate: TranslateService
  ) {
    this.hostEl = this.element.nativeElement;
  }

  ngOnInit() {
    this.route.params.subscribe({
      next: (prop: Params) => {
        this.event$ = this.eventService.getById(prop.id).pipe(
          tap((res) => {
            this.event = res;
            this.setBackgroundImage(res.picture);
          })
        );
      },
    });
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

  private setBackgroundImage(url: string) {
    this.hostEl.style.setProperty('--background-image', `url(${url})`);
  }
}
