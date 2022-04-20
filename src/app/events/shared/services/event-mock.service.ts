import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EventMock } from '../../event-mock';
import { Eventure } from '../../event.model';
import { delay } from 'rxjs/operators';
import keyBy from 'lodash/keyBy';

@Injectable({
  providedIn: 'root',
})
export class EventMockService {
  // Copy object references into the new array (shallow copy)
  // https://stackoverflow.com/questions/7486085/copy-array-by-value
  private data: Eventure[] = [...EventMock.data];
  private events: BehaviorSubject<Eventure[]> = new BehaviorSubject(this.data);

  constructor() {}

  get data$(): Observable<Eventure[]> {
    return this.events.asObservable().pipe(delay(2000)); // delay to simulate http request
  }

  create(event: Eventure): Promise<any> {
    this.data.push(event);
    this.events.next(this.data);

    return Promise.resolve();
  }

  getById(id: string): Promise<Eventure> {
    let eventsKeyById = keyBy(this.data, 'id');
    const event = eventsKeyById[id] || null;
    return new Promise((resolve) => setTimeout(() => resolve(event), 2000));
  }

  update(id: string, data: Partial<Eventure>): Promise<void> {
    let eventsKeyById = keyBy(this.data, 'id');
    eventsKeyById[id] = { ...eventsKeyById[id], ...data };
    this.data = Object.values(eventsKeyById);
    this.events.next(this.data);

    return new Promise((resolve) => setTimeout(() => resolve(), 3000));
  }

  delete(id: string): Promise<void> {
    let eventsKeyById = keyBy(this.data, 'id');
    delete eventsKeyById[id];
    this.data = Object.values(eventsKeyById);
    this.events.next(this.data);

    return Promise.resolve();
  }
}
