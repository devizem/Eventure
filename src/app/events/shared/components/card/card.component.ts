import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { Eventure } from 'src/app/events/event.model';
import { GetDownloadUrlPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'app-card',
  templateUrl: 'card.component.html',
  styleUrls: ['card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() event: Eventure;

  constructor(
    private element: ElementRef,
    private getDownloadUrlPipe: GetDownloadUrlPipe
  ) {}

  async ngOnInit() {
    const downloadUrl = await this.getDownloadUrlPipe.transform(
      this.event.picture
    );
    this.element.nativeElement.style.setProperty(
      '--background-image',
      `url(${downloadUrl}`
    );
  }
}
