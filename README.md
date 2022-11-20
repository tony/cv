# Tony Narlock's CV

**Live Version** [v1 branch] ([react cv], [vue.js cv])

## What's new?

- 100% TypeScript
- yarn monorepo
- Only React (for now, see #1633)
- Webpack from the ground up (no CRA / create-react-app)
- Shared code: Framework agnostic
  - Typed reactive state through [akita]
  - Multiple, lazily-loaded charts options: [@carbon/charts], [plotly],
    [billboard.js]

![image]

[v1 branch]: https://github.com/tony/cv/tree/v1
[react cv]: https://cv.git-pull.com
[vue.js cv]: https://cv-vue.git-pull.com
[akita]: https://github.com/datorama/akita
[image]: packages/lib/assets/architecture.png

## Status

### 🏗️ Frameworks

| Package | Source              | Website                          | Status         |
| ------- | ------------------- | -------------------------------- | -------------- |
| React   | [packages/react/][] | https://cv-react-v2.git-pull.com | 🟡 In-progress |

### ⚙️ Shared code

| Package     | Source                | Details | Status         |
| ----------- | --------------------- | ------- | -------------- |
| UI          | [packages/ui/][]      | N/A     | 🟡 In-progress |
| Common code | [packages/lib/][]     | N/A     | 🟡 In-progress |
| Data        | [packages/data/][]    | N/A     | ✔️ Stable      |
| Scripts     | [packages/scripts/][] | N/A     | ✔️ Stable      |

### 📈 Charts

| Package                   | React                                                  |
| ------------------------- | ------------------------------------------------------ |
| [@carbon/charts]          | 🟡 In-progress, [packages/chart-react-carbon/][]       |
| [plotly]                  | 🟡 In-progress, [packages/chart-react-plotly/][]       |
| [billboard.js]            | 🟡 In-progress, [packages/chart-react-billboard.js/][] |
| [nivo] \(react-only)      | 🟡 In-progress, [packages/chart-react-nivo/][]         |
| [victory] \(react-only)   | 🟡 In-progress, [packages/chart-react-victory/][]      |
| [react-vis] \(react-only) | 🟡 In-progress, [packages/chart-react-vis/][]          |

[@carbon/charts]: https://github.com/carbon-design-system/carbon-charts
[plotly]: https://github.com/plotly/plotly.js
[billboard.js]: https://github.com/naver/billboard.js
[victory]: https://github.com/FormidableLabs/victory
[nivo]: https://github.com/plouc/nivo
[react-vis]: https://github.com/uber/react-vis

## Quickstart

```bash
$ yarn

# Optional: Sync GitHub contributions to packages/data/scraped/
$ yarn github  # Assure GITHUB_API_TOKEN is set

# React
$ cd packages/react/
$ yarn start

# inside any of the 3, to build:
$ yarn build  # Build to dist/
```

### Optional: Pull GitHub contributions

This isn't required as stub data preexists in `packages/data/scraped`.

Create a [GitHub Personal Access Token] and set it in env, ideally _.bashrc_ / _.zshrc_
/ etc. via `export GITHUB_API_TOKEN=INSERT_TOKEN_HERE`. Check `env | grep GITHUB_API` to verify
terminal has the variable set.

For CI systems like GitHub actions, use `CI_GITHUB_API_TOKEN` since variables
with `GITHUB_*` are prohibited.

Edit your username in `packages/scripts/github.ts` and run `yarn github` in the
project root.

[github personal access token]: https://github.com/settings/tokens

## Project specific tasks

#### react

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
  [packages/react/]: packages/react/
  [react]: https://reactjs.org/
  [es2015 class]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
  [packages/scripts/]: packages/scripts/
  [packages/data/]: packages/data/
  [packages/chart-react-vis/]: packages/chart-react-vis/
  [packages/chart-react-nivo/]: packages/chart-react-nivo/
  [packages/chart-react-victory/]: packages/chart-react-victory/
  [packages/chart-react-carbon/]: packages/chart-react-carbon/
  [packages/chart-react-billboard.js/]: packages/chart-react-billboard.js/
  [packages/chart-react-plotly/]: packages/chart-react-plotly/
  [packages/nav/]: packages/nav/
  [packages/ui/]: packages/ui/
  [actors]: https://www.w3.org/TR/activitystreams-core/#actors
  [activities]: https://www.w3.org/TR/activitystreams-core/#activities

## Version 2 (Under development)

- Written from scratch

  No create-react-app

  Better understanding, control of what's being used

  **Spin-off** core webpack starter projects. MIT licensed. Fork to add your own loaders / wire-in
  to your project:

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
