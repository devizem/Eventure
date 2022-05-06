import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';

import { EventService } from './event.service';

describe('EventService', () => {
  let service: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Firestore],
    });
    service = TestBed.inject(EventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
