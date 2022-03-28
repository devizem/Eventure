# Setup dev env/tools

## Use ng schematics instead of @ionic/angular-toolkit

If you run `ng generate component` command it will be interpreted by a ionic schematics instead of angular. This allows Ionic, among other things, to add automatically IonicModule on newly created component.
The backward of Ionic schematics is that sometimes they are not up-to-date w/ Angular and can prevent use of available cli options.
Then we prefer to use angular schematics.

### Remove @ionic/angular-toolkit cli references
To achieve it we remove following nodes from `angular.json`.

```json

  "cli": {
    "defaultCollection": "@ionic/angular-toolkit"
  },
   "schematics": {
    "@ionic/angular-toolkit:component": {
      "styleext": "scss"
    },
    "@ionic/angular-toolkit:page": {
   }
  }
```

### Set scss as ng default style extension

```sh
% ng config projects.app.schematics.@schematics/angular:component.style scss
```

### Make ng components Ionic compliant

- When create module imports IonicModule
- When create component update html to include `ion-content`

OBS: Data path "/projects/app/architect/serve/configurations/ci" must NOT have additional properties(progress).

## Prettier - Code formatting

[ESLint] and [Prettier] help maintaining a consistent style:

- **Prettier for Formatting rules**: eg: max-len, no-mixed-spaces-and-tabs, keyword-spacing, comma-style…
- **ESLint for Code-quality rules**: eg no-unused-vars, no-extra-bind, no-implicit-globals, prefer-promise-reject-errors…

Prettier and ESLint complement each other, but they can also conflict when they disagree about style rules. The Prettier project has a guide to [integrating Prettier with ESLint](https://prettier.io/docs/en/integrating-with-linters.html) to make sure there are no conflicts and a guide on [how to integrate Prettier with your text editor](https://prettier.io/docs/en/editors.html).

```sh
% npm install -D prettier eslint-config-prettier
% npm ls prettier eslint-config-prettier   (master)mmb-demos.crud-angularfire.ionic-v6
├── eslint-config-prettier@8.5.0
└── prettier@2.6.0
% echo {}> .prettierrc.json
% touch .prettierignore
```

## Lint-staged - Pre-commit Hook

You can [use Prettier with a pre-commit tool](https://prettier.io/docs/en/precommit.html). This can re-format your files that are marked as “staged” via git add before you commit.

```sh
% npx mrm@2 lint-staged
```

Update your `package.json` if necessary, `lint-staged` entry should looks:

```
  "lint-staged": {
    "*.ts": "eslint --cache --fix",
    "*.{ts,css,md}": "prettier --write"
  }
```

## Standard-version - Auto versioning

[Standard-version] is an utility for versioning using [semver](https://semver.org/) and CHANGELOG generation powered by [Conventional commits].

```sh
% npm i -g standard-version --save-dev
% standard-version --first-release
✖ skip version bump on first release
✔ created CHANGELOG.md
✔ outputting changes to CHANGELOG.md
✔ committing CHANGELOG.md
✔ tagging release v0.0.1
ℹ Run `git push --follow-tags origin master` to publish
% git push --follow-tags origin master
```

## Dependabot - Automated dependency updates

Keeping your dependencies updated is one of the easiest ways to keep the software you build secure. [Dependabot](https://michaelcurrin.github.io/dev-cheatsheets/cheatsheets/version-control/github/dependabot.html) alleviates that pain by updating your dependencies automatically.

```sh
% mkdir .github
% vi .github/dependabot.yml

# Please see the documentation for all configuration options:
# https://docs.github.com/github/administering-a-repository/configuration-options-for-dependency-updates

version: 2
updates:
  - package-ecosystem: "npm" # See documentation for possible values
    directory: "/" # Location of package manifests
    schedule:
      interval: "daily"
```

## Github Actions - Continuous integration

Required dev tools:

- [x] [CI/CD](https://firebase.google.com/docs/hosting/github-integration)

[standard-version]: https://github.com/conventional-changelog/standard-version
[conventional commits]: https://www.conventionalcommits.org
[eslint]: https://eslint.org/
[prettier]: https://prettier.io/
