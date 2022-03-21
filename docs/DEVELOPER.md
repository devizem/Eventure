# Building and testing new features

This document describes the project structure adopted and how to contribute with new features.

## Project structure

Following [Angular Application structure recommendations](https://angular.io/guide/styleguide#application-structure-and-ngmodules), all feature areas are in their own folder, with their own NgModule.

```sh
./src
  /app
    /core
      analytics.service.ts|spec.ts
    /items
      items.component.ts|html|css|spec.ts
      /item-detail
        item-detail.component.ts|html|css|spec.ts
      /item-form
        item-form.component.ts|html|css|spec.ts
      /shared
        /components
          /item-headline
            item-headline.component.ts|html|css|spec.ts
        /services
          item.service.ts|spec.ts
          item-mock.service.ts
          index.ts
        item-mock.json
        item.model.ts
    /shared
      /components
        index.ts
      /directives
        index.ts
    ...
    app-routing.module.ts
    app.module.ts
```

## Use ng schematics instead of @ionic/angular-toolkit

If you run `ng generate page` command it will be interpreted by a ionic schematics instead of angular. This allow Ionic to add automatically `IonicModule` on newly created page. Same thing occurs with component.
The backward of this configuration is that you can't use all available [angular cli options](https://angular.io/cli/generate), for example [--changeDetection is unknown](https://github.com/ionic-team/angular-toolkit/issues/177).

Then we prefer to use angular schematics to create files based on a schematic.

## Adding Feature

> Rule of thumb is to try to create features which don't depend on any other features just on services provided by CoreModule and components provided by SharedModule.

### Module

It's considered a [best practice to add routing module for each feature module](https://angular.io/guide/lazy-loading-ngmodules).
Then we'll add a new module for stacks (before running each cli I recommend to add `--dry-run` to simulate cmd):

```bash
$ ng generate module items --routing
CREATE src/app/items/items-routing.module.ts (248 bytes)
CREATE src/app/items/items.module.ts (275 bytes)
```

ItemsRoutingModule will handle any items-related routing. This keeps the app's structure organized as the app grows and allows you to reuse this module while easily keeping its routing intact.

ItemsModule is needed for setting up lazy loading for your feature module.

### Pages

```bash
$ ng g component items/items
$ ng g component items/item-detail
```

### Routing

Open and edit `src/app/app-routing.module.ts` to add new module.

```typescript
const routes: Routes = [
  { path: '', redirectTo: '/items', pathMatch: 'full' },
...
  {
    path: 'items',
    loadChildren: () => import('./items/items.module').then(m => m.ItemsModule)
  },
....
];
```

Open and edit src/app/items/items-routing.module.ts to add routes as below:

```typescript
...
import { ItemsComponent } from './items.component';
import { ItemDetailComponent } from './item-detail/item-detail.component';


const routes: Routes = [
  { path: '', component: ItemsComponent},
  { path: 'detail/:id', component: ItemDetailComponent},
];
...
```

### Model

```bash
$ ng g class items/items --type=model
```

## Navigating

## Testing

## Clean code concepts

We follow [Robert C. Martin's Clean Code principles, adapted for JavaScript](https://github.com/ryanmcdermott/clean-code-javascript). Find below some others best practices we follow:

### Boolean var prefix `isLoggedIn` or `hasAccess`

Prefix boolean variables and function names with "is" or "has". You know, something like isLoggedIn, hasAccess.
Use affirmative names, avoid `isDisabled`, prefer `isEnabled`.

[dev.to - Tips on naming boolean variables](https://dev.to/michi/tips-on-naming-boolean-variables-cleaner-code-35ig)

### Private var prefix `_items`

Ex.: `src/app/modules/dynamic-layout/dynamic-layout.component.ts`

```typescript
private _items: any[];
```

### [Dollar signs in variable names for Observables](https://angular.io/guide/rx-library#naming-conventions-for-observables)

Ex.: `src/app/pages/project/project.page.ts`

```typescript
this.project$ = this.projectService.selectAndGet(this.projectId);
```

### [Trailing comma](https://recology.info/2019/02/trailing-commas/)

Ex.: `src/app/modules/dynamic-layout/dynamic-layout.module`

```typescript
exports: [
  DynamicLayoutComponent,
  CarouselSliderComponent,
  FilterableListComponent,
  FilterableToolbarComponent,
  GridListComponent,
];
```

### Typescript aliases

When available prefer [aliases on imports](https://christianlydemann.com/simpler-typescript-paths-with-path-aliases/) instead of relative paths.
For example on `src/app/pages/home/home.page.ts`:

```ts
import { Stack } from "@shared/models/stack.model";
```

Manage aliases on tsconfig

```ts
"paths": {
  "@stacks/*": [
    "src/app/stacks/*"
  ],
  "@shared/*": [
    "src/app/shared/*"
  ]
}
```

## Code linting and formatting

### ESLint and Prettier

We use [ESLint] and [Prettier] to help maintaining a consistent style:

- **Prettier for Formatting rules**: eg: max-len, no-mixed-spaces-and-tabs, keyword-spacing, comma-styleâ€¦
- **ESLint for Code-quality rules**: eg no-unused-vars, no-extra-bind, no-implicit-globals, prefer-promise-reject-errorsâ€¦

Prettier and ESLint complement each other, but they can also conflict when they disagree about style rules. To turn off rules that conflict or are unnecessary with Prettier, we've added the pre-made config [eslint-config-prettier].

OBS: if you use VSCode text editor, I strongly recommend to add [ESLint - dbaeumer.vscode-eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier - esbenp.prettier-vscode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extensions and set Prettier as default formatter. It is customized via the `editor.defaultFormatter` setting.

Below I share my [VSCode settings.json](https://code.visualstudio.com/docs/getstarted/settings#_settings-file-locations), I use prettier as default formatter, only if prettier config exists, and [format file on save only modifications](https://github.com/microsoft/vscode/issues/44075#issuecomment-678231273).

You can edit the underlying `settings.json` file by using the `Open Settings (JSON)` command.

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "prettier.requireConfig": true,
  "editor.formatOnSave": true,
  "editor.formatOnSaveMode": "modifications"
}
```

### Preventing ESLint and formatting errors from being committed

To ensure all files committed to git don't have any linting or formatting errors, we use [lint-staged]. lint-staged allows to run linting commands on files that are staged to be committed. When lint-staged is used in combination with [husky], the linting commands specified with lint-staged are executed to staged files on pre-commit.

[eslint]: https://eslint.org/
[prettier]: https://prettier.io/
[lint-staged]: https://github.com/okonet/lint-staged
[husky]: https://github.com/typicode/husky
[eslint-config-prettier]: https://github.com/prettier/eslint-config-prettier

## Furthermore

- [Tomas Trajan - 6 Best Practices & Pro Tips when using Angular CLI](https://medium.com/@tomastrajan/6-best-practices-pro-tips-for-angular-cli-better-developer-experience-7b328bc9db81)
- [Rik de Vos - 5 Tips & Best Practices to Organize your Angular Project](https://medium.com/dev-jam/5-tips-best-practices-to-organize-your-angular-project-e900db08702e)
