import { EventMock } from '../../event-mock';
import { Eventure } from '../../event.model';
import { EventMockService } from './event-mock.service';
import keyBy from 'lodash/keyBy';

describe('EventMockService', () => {
  let eventMockService: EventMockService;
  beforeEach(() => {
    eventMockService = new EventMockService();
  });

  it('#data$ should return a non-empty array of events', (done: DoneFn) => {
    eventMockService.data$.subscribe((events) => {
      expect(!!events.length).toBeTrue();
      done();
    });
  });

  it('#create should create event on data store', (done: DoneFn) => {
    const event = new Eventure({ id: 125, name: 'New event' });
    eventMockService.create(event).then((_) => {
      eventMockService.data$.subscribe((events) => {
        expect(events.length === EventMock.data.length + 1).toBeTrue();
        done();
      });
    });
  });

  it('#update should update event on data store', (done: DoneFn) => {
    const name = 'Updated event';
    const id = '123';
    eventMockService.update(id, { name }).then((_) => {
      eventMockService.getById(id).then((event) => {
        expect(event.name === name).toBeTrue();
        done();
      });
    });
  });

  it('#update should update event on data$', (done: DoneFn) => {
    const name = 'Updated event';
    const id = '123';
    eventMockService.update(id, { name }).then((_) => {
      eventMockService.data$.subscribe((events) => {
        let eventsKeyById = keyBy(events, 'id');
        expect(eventsKeyById[id].name === name).toBeTrue();
        done();
      });
    });
  });

  it('#delete should delete event on data store', (done: DoneFn) => {
    const id = '123';
    eventMockService.delete(id).then((_) => {
      eventMockService.getById(id).then((event) => {
        expect(event === null).toBeTrue();
        done();
      });
    });
  });

  it('#delete should delete event on data$', (done: DoneFn) => {
    const id = '123';
    eventMockService.delete(id).then((_) => {
      eventMockService.data$.subscribe((events) => {
        let eventsKeyById = keyBy(events, 'id');
        expect(eventsKeyById[id] === undefined).toBeTrue();
        done();
      });
    });
  });

  it('#getById return null if item not exists', (done: DoneFn) => {
    const id = '129';
    eventMockService.getById(id).then(res => {
      expect(res === null).toBeTrue();
      done();
    });
  });
});
