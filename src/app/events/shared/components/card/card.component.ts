import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { Eventure } from 'src/app/events/event.model';

@Component({
  selector: 'app-card',
  templateUrl: 'card.component.html',
  styleUrls: ['card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() event: Eventure;

  constructor(private element: ElementRef) {}

  ngOnInit() {
    this.element.nativeElement.style.setProperty(
      '--background-image',
      `url(${this.event.picture}`
    );
  }
}
