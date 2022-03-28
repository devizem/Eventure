import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
// Models
import { Event } from '../event.model';


@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
})
export class EventFormComponent implements OnInit {

  @Input() event: any;

  newEvent: Event;
  profileForm: any;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.profileForm = new FormGroup({
      title: new FormControl(this.event ? this.event.title : ''),
      location: new FormControl(this.event ? this.event.location : ''),
      description: new FormControl(this.event ? this.event.description : ''),
    })
  }

    createNewEvent() {
     this.event = {
       id: '',
       highlight: '',
       createdAt: '',
       modifiedAt: '',
       link: '',
       userId: '',
       title: '',
       location: '',
       description: ''
     }
     console.log('created')

     // Refactor: change this temporary id used for developing assistance
     const timeStamp = Date.now();
     const newId = timeStamp + localStorage.length;

     Object.assign(this.event, this.profileForm.value, {id: newId});
  }

  editEvent(){
    console.log('edited')
    Object.assign(this.event, this.profileForm.value);
  }

  eventExist() {
    return this.event ? localStorage.getItem(this.event.id) !== null : false;
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  onSubmit() {
    if(this.eventExist()){
       this.editEvent();
    } else {
      this.createNewEvent();
    }
    const newEventEntry = JSON.stringify(this.event);

    localStorage.setItem(this.event.id, newEventEntry);

    // Missing: dismiss model new arguments;
    this.dismissModal();
  }
}
