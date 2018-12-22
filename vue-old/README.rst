Tony Narlock's CV (Vue.js)
==========================

This single page application (SPA) uses `Vue.js`_, ES6, and `vuex`_
as a global data singleton, and a as well as `Single File Components
<https://vuejs.org/v2/guide/single-file-components.html>`__.

Everything is tied together via `webpack <https://webpack.js.org/>`__.

Install and build
-----------------

Prerequisites: To build, ensure you have `node`_ + `yarn`_ installed.

Development: ``$ yarn``, ``$ npm run dev``, and go to http://localhost:8080

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

  (There is a React version */react/*)

  Both are good. Vue.js is a lot simpler. There's less libraries to worry
  about. But if the data was any more complex, a solution like react and
  stuff may be needed.

- Since the items follow the same container format and styling,
  the components/Row.vue is used as a `named slot
  <https://vuejs.org/v2/guide/components.html#Named-Slots>`_

  This is used with Patch, which uses slows for the ``Row`` component.

- Dates scaped in are in `ISO-8601`_ format, which is compatible
  with `moment.js`_. So something like ``2010-12-30`` is valid.

Reactivity and performance considerations
-----------------------------------------

- https://vuejs.org/v2/style-guide/#Avoid-v-if-with-v-for-essential
- https://gist.github.com/DawidMyslak/2b046cca5959427e8fb5c1da45ef7748
- https://vuejs.org/v2/guide/reactivity.html
- https://github.com/vuejs/vuex/issues/888#issuecomment-331702517

Moving forward
--------------

With GitHub's new API, it may be lot easier to reintroduce live browser
queries to API.

*Re: Optimizing getters/reducers*

The code to filter (as of 2018-02-01) is not efficient. I don't intend on
optimizing or restructuring the data until the very end when the
structures are set in stone. Refactoring data structures and flow is costly, and the only
real way to test someone's chops in this respect is in the final stages.
A wise programmer isn't going to try to play a prophet and guess what the
data layout will be like in early stages, premature optimization is the
root of all evil.

.. _Vue.js: https://vuejs.org/
.. _vuex: https://vuex.vuejs.org/en/
.. _node: https://nodejs.org/en/
.. _yarn: https://yarnpkg.com/en/
.. _moment.js: http://momentjs.com/
.. _ISO-8601: https://en.wikipedia.org/wiki/ISO_8601
