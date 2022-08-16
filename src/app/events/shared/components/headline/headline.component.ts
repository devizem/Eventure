import { Component, Input } from '@angular/core';
import { Eventure } from 'src/app/events/event.model';
import { GetDownloadUrlPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'app-headline',
  templateUrl: './headline.component.html',
  styleUrls: ['./headline.component.scss'],
})
export class HeadlineComponent {
  @Input() events: Eventure[];

  constructor() {}
}
