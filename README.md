# Tony Narlock's CV

**Live Version** [v1 branch] ([react cv], [vue.js cv])

**Version 2 underway!**

It's winter of 2020. I'm still very open-minded react and vue.js.

![image]

Let's see what's the latest and greatest for both of these.

This time we're using typescript and wiring-in webpack from the ground up.

[v1 branch]: https://github.com/tony/cv/tree/v1
[react cv]: https://cv.git-pull.com
[vue.js cv]: https://cv-vue.git-pull.com
[image]: packages/lib/assets/architecture.png

## Status

- React: 🟡 In-progress (https://cv-react-v2.git-pull.com)
- Angular: ❌ Unstarted (https://cv-angular-v2.git-pull.com)
- Vue: ❌ Unstarted (https://cv-vue-v2.git-pull.com)

## Quickstart

```bash
$ yarn

# Optional: Sync GitHub contributions to data/scraped/
$ yarn github  # Assure GITHUB_API_TOKEN is set

# React
$ cd packages/react/
$ yarn start

# Vue
$ cd packages/vue/
$ yarn start

# Angular
$ cd packages/angular/
$ yarn global add @angular/cli
$ yarn start

# inside any of the 3, to build:
$ yarn build  # Build to dist/
```

### Optional: Pull GitHub contributions

This isn't required as stub data preexists in `packages/data/scraped`.

Create a [GitHub Personal Access Token] and set it in env, ideally _.bashrc_ / _.zshrc_
/ etc. via `export GITHUB_API_TOKEN=INSERT_TOKEN_HERE`. Check `env | grep GITHUB_API` to verify
terminal has the variable set.

Edit your username in `packages/scripts/github.ts` and run `yarn github` in the
project root.

[github personal access token]: https://github.com/settings/tokens

## Project specific tasks

#### react, vue, angular

Start dev server / live reload:

```bash
yarn start
```

Build to `dist/`:

```bash
yarn build
```

Lint project

```bash
yarn lint
```

Package updates (requires [ncu]):

```bash
yarn ncu

# Apply package updates to `package.json`
yarn ncu -u
```

[ncu]: https://www.npmjs.com/package/npm-check-updates

#### data

Download latest github color mapping:

```bash
$ yarn workspace @tony/cv-data run github-colors
```

#### lib

Run jest tests

```bash
yarn workspace @tony/cv-lib run jest
```

## Global tasks

Install all packages:

```bash
$ yarn
```

Lint all packages:

```bash
yarn workspaces run lint
```

## Structure

- New framework: Angular

  I can't find a way to get building/linting [lib/] working without having these here and/or in
  `packages/lib/`. I'm looking for clean workarounds for this that don't involve unnecessary duplication.

- [packages/vue/][]: [Vue.js] version

- [packages/react/][]: [React] version

- [packages/lib/][]: Common code (reducers/filters code, initial data collections)

  `lib/search.ts` - Search manager for filtering / faceting state. Each application uses this to
  hold raw state (of all activities, places), current filters, and filters/items available with
  filters applied.

  This essentially replaces what a global storage, such as redux/vuex. So there's no need to have
  three systems. And this is custom tailored to the job being done. Which in a sense increases
  readability.

  It has write inherent write protection and safety as it's just an ordinary [ES2015 class]

- [packages/scripts/][]: GitHub Scraper

- [packages/data/][]: initial data

  - _my_actors.json_: [Actors] noun, person, place, thing, etc.
  - _my_activities.json_: [Activities] verb, action, event, happening in relation to an _actor_
  - _scraped/_: data pulled from remote API's (such as _scripts/github.js_)
    - _gh_activities.json_: Pull requests for users _except_ yourself / your own repos. Same
      format as _my_activities.json_, combined.
    - _gh_actors.json_: GitHub Repos. Same schema as _my_actors.json_), combined.

  [packages/lib/]: packages/lib/
  [packages/vue/]: packages/vue/
  [vue.js]: https://vuejs.org/
  [packages/react/]: packages/react/
  [react]: https://reactjs.org/
  [es2015 class]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
  [packages/scripts/]: packages/scripts/
  [packages/data/]: packages/data/
  [actors]: https://www.w3.org/TR/activitystreams-core/#actors
  [activities]: https://www.w3.org/TR/activitystreams-core/#activities

## Version 2 (Under development)

- Written from scratch

  No vue-cli or create-react-app

  Better understanding, control of what's being used

  **Spin-off** core webpack starter projects. MIT licensed. Fork to add your own loaders / wire-in
  to your project:

  - <https://github.com/tony/vue-typescript-vanilla-starter>
  - <https://github.com/tony/react-typescript-vanilla-starter>

- Typescript

  - Typed webpack configuration (webpack.config.ts)

    Maintainability

  - React: Typed components

  - Libraries / Common code: Typed Github commit fetcher

  - Libraries / Common code: Typed data structures

- Lazy loaded, split chunks, smart initialization

  Utilize new splitting, dynamic import, `React.lazy` support in Webpack 4.x
  (<https://webpack.js.org/guides/code-splitting/>)

  Care taken to load essential stuff first and packages like moment (in itself split) last. Some
  experimentation is done here to find a balance of how to present the interface initially and can
  be tweaked overtime.

- Smaller stuff

  Internal data props using underscores now are camelCase, e.g. repo_url -\> repoUrl

## Thanks

[@IonicaBizao/github-colors] - For `data/gh_colors.json` (via `yarn workspace @tony/cv-data run github-colors`), [license
MIT]

[@ionicabizao/github-colors]: https://github.com/IonicaBizau/github-colors
[license mit]: https://github.com/IonicaBizau/github-colors/blob/2ed4842/LICENSE
