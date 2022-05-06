import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EventDetailComponent } from './event-detail.component';
import { RouterTestingModule } from '@angular/router/testing';
import { EventService } from '../shared/services';
import { EventMockService } from '../shared/services/event-mock.service';

describe('EventDetailComponent', () => {
  let component: EventDetailComponent;
  let fixture: ComponentFixture<EventDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EventDetailComponent],
      imports: [IonicModule.forRoot(), RouterTestingModule],
      providers: [{ provide: EventService, useValue: EventMockService }],
    }).compileComponents();

    fixture = TestBed.createComponent(EventDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
