import { Component, Input, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Eventure } from '../event.model';
import { EventService } from '../shared/services';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
})
export class EventFormComponent implements OnInit {

  @Input() event?: Eventure;

  isCreateMode = true;
  isLoading = false;

  eventForm = this.formBuilder.group({
    name: ['', [
      Validators.required
    ]],
    description: ['', [
      Validators.required
    ]]
  })

  constructor(
    private modalCtrl: ModalController,
    private eventService: EventService,
    private formBuilder: FormBuilder
  ) {}

  async ngOnInit(): Promise<any> {
    this.isCreateMode = this.event === undefined;

    if (!this.isCreateMode) {
      this.eventForm.patchValue({
        ...this.event
      })
    }
  }

  async onSubmit() {
    this.isLoading = true;
    try {
      if (!this.isCreateMode) {
        await this.eventService.update(this.event.id, this.eventForm.value);
      } else {
        const uid = Date.now().toString(); //temporary unique Id
        await this.eventService.create(new Eventure({ id: uid, ...this.eventForm.value }));
      }
      this.dismissModal();
    } catch (err) {}
    this.isLoading = false;
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }
}