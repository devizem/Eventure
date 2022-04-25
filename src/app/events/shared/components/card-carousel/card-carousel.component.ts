import {
  Input,
  Component,
  OnInit,
  ViewChildren,
  ElementRef,
  QueryList,
  AfterViewInit,
} from '@angular/core';
import { Eventure } from 'src/app/events/event.model';
import Swiper, { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-card-carousel',
  templateUrl: 'card-carousel.component.html',
  styleUrls: ['card-carousel.component.scss'],
})
export class CardCarouselComponent implements OnInit, AfterViewInit {
  @Input() events: Eventure[];
  @ViewChildren('slides') slidesEl: QueryList<ElementRef>;

  swiper: Swiper;
  config: SwiperOptions = {
    centeredSlides: true,
    slidesPerView: 'auto',
    spaceBetween: 20,
  };

  constructor() {}

  ngOnInit() {
    this.swiper = new Swiper('.swiper-container', this.config);
  }

  ngAfterViewInit(): void {
    this.slidesEl.changes.subscribe((_) => {
      this.swiper.updateSlides();
      this.swiper.slideToClosest(); // onDelete
    });
  }
}
