Design notes
============

This single page application (SPA) is based in `vue.js`_, ES6. It uses `vuex`_ as a global data singleton, and a
as well as `Single File Components
<https://vuejs.org/v2/guide/single-file-components.html>`__.

Everything is tied together via `webpack <https://webpack.js.org/>`__.

Background
----------

In 2014, I wrote a `similar application
<https://github.com/tony/github-exercise>`__ that became deprecated when
GitHub's API changed. In 2018, I am using `vue.js`_ and webpack.

The first project would use find all repositories a user had, and all
contributors the repositories had. It would use asynchronous requests
to GitHub to pull the information and render the information.

At the time, due to limitations with GitHub's API, there was no way to
pull the information without crafting individual child requests for each
repository. This would incur rate limits for very active GH users.

This new project finds all pull requests the user has made. It downloads the
information before hand, instead of doing it life via the browser. A
utility script queries from GitHub's very solid `GraphQL`_ API. See
*scripts/github.js*.

GraphQL makes it easier to articulate efficient queries to access the
information in one request.

.. _graphql: http://graphql.org/

Install and build
-----------------

Prerequisites: To build, ensure you have `node`_ + `yarn`_ installed.

Development: ``$ yarn``, ``$ npm run dev``, and go to http://localhost:8080

Structure
---------

*scripts/* - scripts for scraping and compiling data

Libraries
---------

- based off `vue-cli`_

  rationale: the webpack configuration was set to run in development mode,
  and build producation binaries with relative no added effort.

  it's not much different than what most Vue devs would arrive at if they
  built a layout / webpack config themselves.

- moment.js: nice, human readable dates and times

.. _vue-cli: https://github.com/vuejs/vue-cli

Code decisions and rationale
----------------------------

- Why Vue.js and not react / redux?

  Both are good. Vue.js is a lot simpler. There's less libraries to worry
  about. But if the data was any more complex, a solution like react and
  stuff may be needed.

- Since the items follow the same container format and styling,
  the components/Row.vue is used as a `named slot
  <https://vuejs.org/v2/guide/components.html#Named-Slots>`_

  This is used with Patch, which uses slows for the ``Row`` component.

- Dates scaped in are in `ISO-8601`_ format, which is compatible
  with `moment.js`_. So something like ``2010-12-30`` is valid.

Moving forward
--------------

With GitHub's new API, it may be lot easier to reintroduce live browser
queries to API.

.. _vue.js: https://vuejs.org/
.. _vuex: https://vuex.vuejs.org/en/
.. _node: https://nodejs.org/en/
.. _yarn: https://yarnpkg.com/en/
.. _moment.js: http://momentjs.com/
.. _ISO-8601: https://en.wikipedia.org/wiki/ISO_8601
