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

Why?
----

Due to my atypical startup / open source background, I have work peppered across
the internet that's substantive. Typical resumes don't fit me well.

But most of all, I wanted to create a comparison of Vue vs React (in the
same spirit as my `Django vs Flask`_ article.)

.. _Django vs Flask: https://devel.tech/features/django-vs-flask/

I deliberately swore off front-end JS a few years back, and tried to stay
away from it as much as I could. Now I'm coming back and want to deeply
analyze the productivity, scalability, and performance of them before I
make a final pick.

Ultimately, I plan to create two CV's with the identical UX and (to the
best extent possible) filtering algorithms. The reason for this is I want
to benchmark a medium-sized application in Vue and React, with a few
functional tests, but then also with a "stop watch" type thing for how
long it takes to paint to the screen side-by-side.

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

*Re: Optimizing getters/reducers*

The code to filter (as of 2018-02-01) is not efficient. I don't intend on
optimizing or restructuring the data until the very end when the
structures are set in stone. Refactoring data structures and flow is costly, and the only
real way to test someone's chops in this respect is in the final stages.
A wise programmer isn't going to try to play a prophet and guess what the
data layout will be like in early stages, premature optimization is the
root of all evil.

.. _vue.js: https://vuejs.org/
.. _vuex: https://vuex.vuejs.org/en/
.. _node: https://nodejs.org/en/
.. _yarn: https://yarnpkg.com/en/
.. _moment.js: http://momentjs.com/
.. _ISO-8601: https://en.wikipedia.org/wiki/ISO_8601
