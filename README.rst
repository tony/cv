Tony Narlock's CV
=================

**Live Version** `v1 branch`_ (`react cv <https://cv.git-pull.com>`_, `vue.js cv <https://cv-vue.git-pull.com>`_)

**Version 2 underway!**

It's summer of 2019. I'm still very open-minded react and vue.js.

Let's see what's the latest and greatest for both of these.

This time we're using typescript and wiring-in webpack from the ground up.

.. _v1 branch: https://github.com/tony/cv/tree/v1

Quickstart
----------

.. code-block:: bash

   $ npm install  # Install root deps

   $ cd vue/  # or
   $ cd react/

   # Inside either vue/react
   $ npm install

   # and
   $ npm run start  # Launch dev server / hot reloading
   # or
   $ npm run build  # Build to dist/

Structure
---------
- New framework: Angular

  Excuse to try it for the first time. Very friendly toward typescript and
  mature.
- ``tslint.json``/``tsconfig.json``/``package.json`` in root and/or ``lib/``

  I can't find a way to get building/linting `lib/ <lib/>`_ working without having these
  here and/or in ``lib/``. I'm looking for clean workarounds for this that
  don't involve unnecessary duplication.
- `vue/ <vue/>`_: `Vue.js`_ version
- `react/ <react/>`_: `React`_ version
- `lib/ <lib/>`_: Common code (reducers/filters code, initial data collections)

  ``lib/search.ts`` - Search manager for filtering / faceting state. Each
  application uses this to hold raw state (of all activities, places),
  current filters, and filters/items available with filters applied.

  This essentially replaces what a global storage, such as redux/vuex.
  So there's no need to have three systems. And this is custom tailored to
  the job being done. Which in a sense increases readability.

  It has write inherent write protection and safety as it's just an
  ordinary `ES2015 class <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes>`_
- `scripts/ <scripts/>`_: GitHub Scraper
- `data/ <data/>`_: initial data

  - *my_actors.json*: `Actors`_ noun, person, place, thing, etc.
  - *my_activities.json*: `Activities`_ verb, action, event, happening
    in relation to an *actor*

  - *scraped/*: data pulled from remote API's (such as
    *scripts/github.js*)

    - *gh_activities.json*: Pull requests for users *except* yourself / your
      own repos. Same format as *my_activities.json*, combined.
    - *gh_actors.json*: GitHub Repos. Same schema as
      *my_actors.json*), combined.

.. _Vue.js: https://vuejs.org/
.. _React: https://reactjs.org/
.. _Actors: https://www.w3.org/TR/activitystreams-core/#actors
.. _Activities: https://www.w3.org/TR/activitystreams-core/#activities
.. _Activity Streams: https://www.w3.org/TR/activitystreams-core/#introduction

Version 2 (Under development)
-----------------------------
- Written from scratch

  No vue-cli or create-react-app [#]_

  Better understanding, control of what's being used

  **Spin-off** core webpack starter projects. MIT licensed.
  Fork to add your own loaders / wire-in to your project:

  - https://github.com/tony/vue-typescript-vanilla-starter
  - https://github.com/tony/react-typescript-vanilla-starter

  .. [#] Early stages: tsconfig.json and app.tsx/entrypoint/templates
     were copied over in early commits (see credits)

- Typescript

  - Typed webpack configuration (webpack.config.ts)

    Maintainability

  - React: Typed components

  - Libraries / Common code: Typed Github commit fetcher
  - Libraries / Common code: Typed data structures
- Lazy loaded, split chunks, smart initialization

  Utilize new splitting, dynamic import, ``React.lazy`` support in
  Webpack 4.x (https://webpack.js.org/guides/code-splitting/)

  Care taken to load essential stuff first and packages like
  moment (in itself split) last. Some experimentation is done here
  to find a balance of how to present the interface initially and
  can be tweaked overtime.
- Smaller stuff

  Internal data props using underscores now are camelCase, e.g.
  repo_url -> repoUrl
