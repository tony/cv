# Tony Narlock's CV

**Live Version** Launch: [react v2]

Old: [v1 branch], launch: [react v1], [vue.js v1]

## What's new?

- 100% TypeScript
- yarn monorepo
- Only React (for now, see #1633)
- Vite
- Shared code: Framework agnostic
  - Typed reactive state through [MobX] + [mobx-state-tree]
  - Multiple, lazily-loaded charts options: [@carbon/charts], [plotly],
    [billboard.js]

![image]

[v1 branch]: https://github.com/tony/cv/tree/v1
[react v2]: https://cv-react-v2.git-pull.com
[react v1]: https://cv-react-v1.git-pull.com
[vue.js v1]: https://cv-vue-v1.git-pull.com
[mobx]: https://github.com/mobxjs/mobx
[mobx-state-tree]: https://mobx-state-tree.js.org/
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

| Package                 | React                                                  |
| ----------------------- | ------------------------------------------------------ |
| [@carbon/charts]        | 🟡 In-progress, [packages/chart-react-carbon/][]       |
| [plotly]                | 🟡 In-progress, [packages/chart-react-plotly/][]       |
| [billboard.js]          | 🟡 In-progress, [packages/chart-react-billboard.js/][] |
| [nivo] \(react-only)    | 🟡 In-progress, [packages/chart-react-nivo/][]         |
| [victory] \(react-only) | 🟡 In-progress, [packages/chart-react-victory/][]      |

[@carbon/charts]: https://github.com/carbon-design-system/carbon-charts
[plotly]: https://github.com/plotly/plotly.js
[billboard.js]: https://github.com/naver/billboard.js
[victory]: https://github.com/FormidableLabs/victory
[nivo]: https://github.com/plouc/nivo

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
  [packages/chart-react-nivo/]: packages/chart-react-nivo/
  [packages/chart-react-victory/]: packages/chart-react-victory/
  [packages/chart-react-carbon/]: packages/chart-react-carbon/
  [packages/chart-react-billboard.js/]: packages/chart-react-billboard.js/
  [packages/chart-react-plotly/]: packages/chart-react-plotly/
  [packages/ui/]: packages/ui/
  [actors]: https://www.w3.org/TR/activitystreams-core/#actors
  [activities]: https://www.w3.org/TR/activitystreams-core/#activities

## Version 2 (Under development)

- Written from scratch

  No create-react-app

  Better understanding, control of what's being used

- Lazy loaded, split chunks, smart initialization

- Smaller stuff

  Internal data props using underscores now are camelCase, e.g. repo_url -\> repoUrl

## Thanks

- [@IonicaBizao/github-colors] - For `data/gh_colors.json` (via `yarn workspace @tony/cv-data run github-colors`), [github-colors license]: MIT
- [Octicons] ([primer/octicons](https://github.com/primer/octicons)) - For
  activity timeline icons, [Octicons license]: MIT.
- [Flowbite] - Tailwind Theme UI library, including timeline, [Flowbite
  license]: MIT.

[@ionicabizao/github-colors]: https://github.com/IonicaBizau/github-colors
[github-colors license]: https://github.com/IonicaBizau/github-colors/blob/2ed4842/LICENSE
[Octicons]: https://primer.style/foundations/icons
[Octicons license]: https://github.com/primer/octicons/blob/12b41dc/LICENSE
[Flowbite]: https://github.com/themesberg/flowbite
[Flowbite license]: https://github.com/themesberg/flowbite/blob/b0d2939/LICENSE.md
