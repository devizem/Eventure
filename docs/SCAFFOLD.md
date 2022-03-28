
## Feature module: events

### Module

```
$ ng generate module events --routing
```

### Components

```
$ ng g c events/event-list
$ ng g c events/event-detail
$ ng g c events/event-form
$ ng g c events/event-headline
```

### Routing

Next, open and edit src/app/events/events-routing.module.ts to add new routes. No need to import components we’ll prefer lazy-loading.

```
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './pages/events-list/events-list.module#eventsListPageModule'},
  { path: 'detail/:id', loadChildren: './pages/event-detail/event-detail.module#eventDetailPageModule'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class eventsRoutingModule { }
```

And now add events route on `AppRoutingModule`

```
...
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'events', loadChildren: './events/events.module#eventsModule' },
];
...
```

At this stage you can add links on pages to test navigation or access directly to lazy-loaded pages running `ionic serve` and typing url on address bar of your browser.

’/’ for home
‘/events’ for events-list
‘/events/detail/123’ for event-detail

## Data modeling

### Model

```
$ ng generate class events/event --type model --skipTests
CREATE src/app/events/event.model.ts (22 bytes)
```

```ts
export class event {
  id: string;
  name: string,
  description?: string,
  picture?: string,
  startDate: string = null,  // 2018-10-09T16:18:45Z
  endDate: string = null,  // 2018-10-09T16:18:45Z
  createdDate: string = null,  // 2018-10-09T16:18:45Z
  modifiedDate: string = null,  // 2018-10-09T16:18:45Z
  publishedDate: string = null  // 2018-10-09T16:18:45Z

  constructor(props: any) {
    Object.entries(props).forEach(([key, value]) => (this[key] = value));
  }
}
```

### Mock

```
$ ng g class events/event-mock --skipTests
CREATE src/app/events/event-mock.ts (26 bytes)
```

```ts
export class EventMock {
  public static data: Eventure[] = [
    {
      id: '123',
      name: 'I learned to READ my dreams (and you can too)',
      description:
        'One night, about 18 months ago, I had a vivid dream about a mole that was poisoning me. When, a few nights later, I had the same strange dream again, I Googled what being sick in a dream might mean.',
      picture:
        'https://i.dailymail.co.uk/1s/2019/08/28/21/17803628-0-image-a-131_1567024609120.jpg',
      startDate: '2019-08-28T14:48:00.000Z',
      endDate: '2019-08-28T14:48:00.000Z',
      publishedAt: '2019-08-28T14:48:00.000Z',
      createdAt: '2019-08-28T14:48:00.000Z',
      modifiedAt: '2019-08-28T14:48:00.000Z',
    },
    {
      id: '124',
      name: "Square Crypto Praises Gimmicky Bitcoin Giveaways but Doesn't Give Any Away",
      description:
        'Basically, Square Crypto argues that if you give bitcoin to someone (especially a skeptic), they’ll become emotionally invested in its success. Why? Because then they’ll have skin in the game.',
      picture:
        'https://www.ccn.com/wp-content/uploads/2019/08/bitcoin-giveaway-ss.jpg',
      startDate: '2019-08-28T14:48:00.000Z',
      endDate: '2019-08-28T14:48:00.000Z',
      publishedAt: '2019-08-28T14:48:00.000Z',
      createdAt: '2019-08-28T14:48:00.000Z',
      modifiedAt: '2019-08-28T14:48:00.000Z',
    },
  ];
}
```

## Observable data service

### Mock

```
$ ng g service events/shared/services/event-mock
CREATE src/app/events/shared/services/event-mock.service.spec.ts (373 bytes)
CREATE src/app/events/shared/services/event-mock.service.ts (138 bytes)
```

```js
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

    return Promise.resolve();
  }

  delete(id: string): Promise<void> {
    let eventsKeyById = keyBy(this.data, 'id');
    delete eventsKeyById[id];
    this.data = Object.values(eventsKeyById);
    this.events.next(this.data);

    return Promise.resolve();
  }
}
```

## Templates

### item-list

```html
<ng-container *ngIf="items$ | async as items; else loading">
  <div *ngIf="items.length > 0; else empty">
    <ul *ngFor="let item of items">
      <li routerLink="/items/detail/{{ item.id }}">{{ item.title }}</li>
    </ul>
  </div>
</ng-container>
<ng-template #loading>Loading...</ng-template>
<ng-template #empty>No items found!</ng-template>
```


### item-detail

```html
<ng-container *ngIf="item !== undefined; else loading">
  <div *ngIf="item !== null; else empty">
    <h2>{{ item.title }}</h2>
  </div>
</ng-container>
<ng-template #loading>Loading...</ng-template>
<ng-template #empty>Item not found!</ng-template>
```

## PWA

According to Google, there are [three characteristics that define every PWA](https://developers.google.com/web/progressive-web-apps/):

- Reliable - Load instantly and never show the downasaur, even in uncertain network conditions.
- Fast - Respond quickly to user interactions with silky smooth animations and no janky scrolling.
- Engaging - Feel like a natural app on the device, with an immersive user experience.

Angular built-in PWA with [@angular/pwa](https://angular.io/guide/service-worker-getting-started).

Testing with [Lighthouse](https://developers.google.com/web/ilt/pwa/lighthouse-pwa-analysis-tool) and [thinkwithgoogle - Test my site](https://www.thinkwithgoogle.com/feature/testmysite) (for layman’s terms)

Performance:

- Caching
- Image optimization

[node.js]: https://nodejs.org/en/download/
[git]: http://git-scm.com/download
[ionic]: https://ionicframework.com/
[cordova]: https://cordova.apache.org/
[angularfire]: https://github.com/angular/angularfire2
[angular]: https://angular.io/
[firebase]: https://firebase.google.com/
[firestore]: https://firebase.google.com/products/firestore/
[firebase authentication]: https://firebase.google.com/docs/auth
