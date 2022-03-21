# Eventure

## What we’ll build

We'll create an Event Repository app to find out traditional events all over the world, w/ advanced search options (incl. geo queries), share w/ friends and set reminder.
The aim of app is to store interesting events to give travel ideas, or discover new cultures and traditions.

We'll use [Ionic] for UI with [Angular], [Firestore] as Cloud db and [AngularFire], the official Angular library for Firebase.

The great thing about [Ionic](https://ionicframework.com/) is that with one codebase, you can build for any platform using just HTML, CSS, and JavaScript.

Highlights include:

- One Angular-based codebase that runs on the web, iOS, and Android using Ionic Framework UI components.
- Deployed as a PWA using [@angular/pwa](https://angular.io/guide/service-worker-getting-started)
- Deployed as a native iOS and Android mobile app using Capacitor, Ionic's official native app runtime.
- Event search functionality [nearby](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) or on selected location powered by the [Geo queries](https://firebase.google.com/docs/firestore/solutions/geoqueries).
- Provide [user authentication](https://firebase.google.com/docs/auth/web/firebaseui) to ...
- [Firebase Cloud function](https://firebase.google.com/products/functions) to handle backend img processing, geo coordinates and notifications.

## Good practices

### Coding

Our main concern is to apply good/recommended coding practices:

- [x] Lazy load pages and deep-linking
  - [Angular Firebase: How to Lazy Load Components in Angular 4 in Three Steps](https://angularfirebase.com/lessons/how-to-lazy-load-components-in-angular-4-in-three-steps/)
- [x] Shared and Core modules
  - [6 Best Practices & Pro Tips when using Angular CLI](https://medium.com/@tomastrajan/6-best-practices-pro-tips-for-angular-cli-better-developer-experience-7b328bc9db81)
- [x] Observable data service
  - [Angular university - How to build Angular apps using Observable Data Services](https://blog.angular-university.io/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/)
  - [Cory Rylan - Angular Observable Data Services](https://coryrylan.com/blog/angular-observable-data-services)
- [x] Keep a consistent timestamp via back-end server
  - [AngularFirebase: CRUD Operations with Server Timestamps](https://angularfirebase.com/lessons/firestore-advanced-usage-angularfire/#3-CRUD-Operations-with-Server-Timestamps)

## What you'll need

We need to have [Node.js] and [Git] installed in order to install both [Ionic] and [Cordova]. Follow the [Android](https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html) and [iOS](https://cordova.apache.org/docs/en/latest/guide/platforms/ios/index.html) platform guides to install required tools for development.

And of course you'll also need a [Firebase] account.

## Methodology

Each main section below corresponds to a visible milestone of the project, where you can validate work on progress running App.

1. Create a project
2. Run & deploy the application
3. Create pages and routing
4. Data modeling
5. Add Firebase on project
6. Observable data service

By this way you can pickup what is interesting for you and/or run tutorial on several days always keeping a stable state of project, avoid big bang ;-)

## Create your project

### Prerequisites

- [@ionic/cli](https://ionicframework.com/docs/cli)
- [native-run](https://www.npmjs.com/package/native-run), used to run native binaries on devices and simulators/emulators
- [cordova-res](https://www.npmjs.com/package/cordova-res), used to generate native app icons and splash screens:

```sh
$ npm install -g @ionic/cli native-run cordova-res
$ npm ls -g cordova @ionic/cli@ npm typescript @angular/cli                                      (master)eventure
├── @angular/cli@13.3.0
├── @ionic/cli@6.18.2
├── npm@8.3.1
└── typescript@4.6.2
```

### Create an Ionic/angular app

Next, create an Ionic Angular app that uses the “blank” starter template and adds Cordova for native functionality:

```
$ ionic start eventure blank --type=angular --cordova --package-id=com.eventure.app
```

That means:

- `ionic start` creates the app.
- `eventure` is the name we gave it.
- `blank` tells the Ionic CLI the template you want to start with. You can list available templates using [ionic start --list](https://ionicframework.com/docs/cli/commands/start#options)
- `--type=angular` type of project to start (e.g. angular, react, ionic-angular, ionic1)
- `--capacitor` include Cordova integration (default config.xml, iOS and Android resources, like icon and splash screen)
- `--package-id=com.eventure.app` specify the bundle ID/application ID for your app (reverse-DNS notation)

## Run the application

### Run on web browser

```
$ cd eventure
$ ionic serve
> ng run app:serve --host=localhost --port=8100
...
```

### Ionic lab to test iOS and Android rendering

To test iOS and Android views I recommend using [@ionic/lab](https://www.npmjs.com/package/@ionic/lab) package

`$ npm i --save-dev @ionic/lab`

and run

```
$ ionic serve --lab
```

### Deploy native Apps on device

It's not the purpose of this tutorial, so I will not develop this topic but if you need check links below for more details:

- [deploy Ionic apps to iOS](https://ionicframework.com/docs/building/ios) simulators and devices using Cordova
- [deploy Ionic apps to Android](https://ionicframework.com/docs/building/android) simulators and devices using Cordova

# Feature module: events

## Module

```
$ ng generate module events --routing
```

## Components

```
$ ng g c events/event-list
$ ng g c events/event-detail
$ ng g c events/event-form
$ ng g c events/event-headline
```

## Routing

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

```
export class event {
  id: string;
  highlight: string;
  createdAt: string; // 2018-10-09T16:18:45Z
  modifiedAt: string; // 2018-10-09T16:18:45Z
  link: string;
  userId: string;
}
```

### Mock

## Observable data service

### Mock
