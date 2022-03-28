import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
// Models
import { Event } from '../event.model';
// Components
import { EventFormComponent } from '../event-form/event-form.component';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
})
export class EventDetailComponent implements OnInit {

  private sub: Subscription;
  
  title: string;
  location: string;
  description: string;
  id: string;
  highlight: string;
  createdAt: string;
  modifiedAt: string;
  userId: string;
  link: string;

  event: Event;

  constructor(private route: ActivatedRoute, private modalCtrl: ModalController) {}

  ngOnInit() {
    this.sub = this.route.paramMap.subscribe((event: ParamMap) => {
      this.id = event.get('id');
      this.title = event.get('title');
      this.location = event.get('location');
      this.description = event.get('description');
      const highlight =  '';
      const createdAt = '';
      const modifiedAt = '';
      const userId = '';
      const link = '';

      this.event = {
        id: this.id,
        title: this.title,
        location: this.location, 
        description: this.description,
        highlight,
        createdAt,
        modifiedAt,
        userId,
        link 
      }
    })

    // Refactor: avoid repeting and for more dynamic variable designation
  }

  //Note: ActivatedRoute observable are unsubscribed by router itself 

  async openModel(event) {
    const modal = await this.modalCtrl.create({
      component: EventFormComponent,
      componentProps: {event: this.event}
    });

    await modal.present();
  }

  onDeleteHandle() {
    // Missing: routing back to events
    localStorage.removeItem(this.event.id);
  }
}
