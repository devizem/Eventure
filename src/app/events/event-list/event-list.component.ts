import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
// Components
import { EventFormComponent } from '../event-form/event-form.component';
// Models
import { Event } from '../event.model';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit {

  events: Event[] = [];

  staticEvents: Event[] = [
    {
    id: '4243',
    highlight: '42432',
    createdAt: '324242', // 2018-10-09T16:18:45Z
    modifiedAt: '423423', // 2018-10-09T16:18:45Z
    link: '42342',
    userId: '42342',
    title: 'Festa de S. João',
    location: 'Porto',
    description: 'On the night of 23 June (Saint John\'s Eve),thousands of people come to the city centre and more traditional neighborhoods to pay a tribute to Saint John the Baptist, in a party that mixes sacred and profane traditions.'
  },
  {
    id: '4113',
    highlight: '75462',
    createdAt: '3645342', // 2018-10-09T16:18:45Z
    modifiedAt: '47223', // 2018-10-09T16:18:45Z
    link: '42346',
    userId: '4234562',
    title: 'Queima das Fitas',
    location: 'Porto',
    description: 'Queima das Fitas (Ribbon Burning) is a traditional festivity of the students of some Portuguese universities, organized originally by the students of the University of Coimbra.'
  },
  {
    id: '43123',
    highlight: '7234462',
    createdAt: '3462342', // 2018-10-09T16:18:45Z
    modifiedAt: '3524523', // 2018-10-09T16:18:45Z
    link: '423234',
    userId: '4534562',
    title: 'A Regata de Barcos Rabelos',
    location: 'Porto',
    description: 'A Regata de Barcos Rabelos (Rabelo Boat Regatta), the most colorful and popular event of the "Confraria do Vinho do Porto" (Port Wine Brotherhood). Boats parade their company brands while fiercely competing for first place.'
  },
]

constructor(private modalCtrl: ModalController){}

ngOnInit(): void {
  this.staticEvents.forEach(event => {
    const newData = JSON.stringify(event);
    localStorage.setItem(event.id, newData)
  })
  this.getEvents();

  // Bug: static data set in the local storage every life cycle start
}

getEvents(): void {
  Object.keys(localStorage).forEach(eventKey => {
    const eventData = localStorage.getItem(eventKey);
    const event = JSON.parse(eventData);
    this.events.push(event);
  })
}

async openModel() {
  const modal = await this.modalCtrl.create({
    component: EventFormComponent
  });

  await modal.present();
}

}
