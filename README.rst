Tony Narlock's CV
=================
It's summer of 2019. 

v2 started! I'm still very open-minded about frontend frameworks.

Let's see what's the latest and greatest for both of these.
This time we're using typescript and wiring in webpack from the ground up.

Quickstart
----------

.. code-block:: bash

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
- `vue/ <vue/>`_: `Vue.js`_ version
- `react/ <react/>`_: `React`_ version
- `lib/ <lib/>`_: Common code (reducers/filters code, initial data collections)
- `scripts/ <scripts/>`_: GitHub Scraper
- `static/ <static/>`_: Static assets (images) shared across versions
- yarn.lock / package.json: Packages for *scripts/* files
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

Live Version: `v1 branch`_
--------------------------
React: https://cv.git-pull.com
vue: https://cv-vue.git-pull.com

.. _v1 branch: https://github.com/tony/cv/tree/v1

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
