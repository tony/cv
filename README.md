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
[image]: lib/assets/architecture.png

## Quickstart

_Required:_ Create a [GitHub Personal Access Token] and set it in env, ideally _.bashrc_ / _.zshrc_
/ etc. via `export GITHUB_API_TOKEN=INSERT_TOKEN_HERE`. Check `env | grep GITHUB_API` to verify
terminal has the variable set.

```bash
$ yarn global add @angular/cli  # If building angular

$ make install  # Install root deps

$ yarn github  # Assure GITHUB_API_TOKEN is set

$ cd vue/  # or
$ cd react/

# Inside either angular/vue/react
$ yarn

# and
$ yarn start  # Launch dev server / hot reloading
# or
$ yarn build  # Build to dist/
```

[github personal access token]: https://github.com/settings/tokens

## Make tasks

Common tasks across 3 projects (+1 if you include root scripts) are the in [Makefile][]:

```bash
$ make clean  # deletes typescript, yarn cache, node_modules/ in all projects
$ make distclean  # removes dist/ in all projects
$ make install  # runs yarn install for all projects
$ make yarn_outdated # runs yarn outdated for all projects
$ make yarn_update  # runs yarn update for all projects
```

[makefile]: Makefile

## Structure

- New framework: Angular

  Excuse to try it for the first time. Very friendly toward typescript and mature.

- `tslint.json`/`tsconfig.json`/`package.json` in root and/or `lib/`

  I can't find a way to get building/linting [lib/] working without having these here and/or in
  `lib/`. I'm looking for clean workarounds for this that don't involve unnecessary duplication.

- [vue/][]: [Vue.js] version

- [react/][]: [React] version

- [lib/][]: Common code (reducers/filters code, initial data collections)

  `lib/search.ts` - Search manager for filtering / faceting state. Each application uses this to
  hold raw state (of all activities, places), current filters, and filters/items available with
  filters applied.

  This essentially replaces what a global storage, such as redux/vuex. So there's no need to have
  three systems. And this is custom tailored to the job being done. Which in a sense increases
  readability.

  It has write inherent write protection and safety as it's just an ordinary [ES2015 class]

  `lib/types.ts` - Typing for data mappings used across the three apps `lib/data/raw.ts` - Raw
  data imported via JSON + typed

- [scripts/][]: GitHub Scraper

- [data/][]: initial data

  - _my_actors.json_: [Actors] noun, person, place, thing, etc.
  - _my_activities.json_: [Activities] verb, action, event, happening in relation to an _actor_
  - _scraped/_: data pulled from remote API's (such as _scripts/github.js_)
    - _gh_activities.json_: Pull requests for users _except_ yourself / your own repos. Same
      format as _my_activities.json_, combined.
    - _gh_actors.json_: GitHub Repos. Same schema as _my_actors.json_), combined.

  [lib/]: lib/
  [vue/]: vue/
  [vue.js]: https://vuejs.org/
  [react/]: react/
  [react]: https://reactjs.org/
  [es2015 class]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
  [scripts/]: scripts/
  [data/]: data/
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

[@IonicaBizao/github-colors] - For `data/gh_colors.json` (via `yarn github-colors.json`), [license
MIT]

[@ionicabizao/github-colors]: https://github.com/IonicaBizau/github-colors
[license mit]: https://github.com/IonicaBizau/github-colors/blob/2ed4842/LICENSE
