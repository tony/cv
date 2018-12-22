Tony Narlock's CV (React)
=========================

This single page application (SPA) using `React`_

Everything is tied together via `webpack <https://webpack.js.org/>`__.

Install and build
-----------------

Prerequisites: To build, ensure you have `node`_ + `yarn`_ installed.

Development: ``$ yarn``, ``$ npm start``, and go to
http://localhost:3000

Libraries
---------

- based off `create-react-app`_

  rationale: the webpack configuration was set to run in development mode,
  and build producation binaries with relative no added effort.

  it's not much different than what most `Vue.js`_ devs would arrive at if they
  built a layout / webpack config themselves.

  On 2018-02-13, `6ed6bc6`_ ejected create-react-app. For two reasons:

  1. By default, ``npm run build`` would fail minification when accessing the
     ES6+ code in ``lib/storage.js``. In order for babel to correctly handle
     the packages symlinked from the parent directory (via yarn workspaces),
     the package names need to be mapped via ``require.resolve``.
  2. ``lib/`` aka ``cv-lib`` also has static files such as images and CSS
     to include.

  Both of the above require modifying the webpack config manually. So
  ``npm run eject`` was ran to split the webpack files and package
  dependenies out.

  .. _6ed6bc6: https://github.com/tony/cv/commit/6ed6bc6c04ba76ad84f422abfdfed6442004ef2d

- moment.js: nice, human readable dates and times

.. _create-react-app: https://github.com/facebook/create-react-app

Code decisions and rationale
----------------------------

- Why React.js and not Vue.js?

  React.js has more activity (by far), potential mobile output.

  My hypothesis is the renders could be faster, and binaries produced
  smaller. This is what I hope to test during this.

- Dates scaped in are in `ISO-8601`_ format, which is compatible
  with `moment.js`_. So something like ``2010-12-30`` is valid.

.. _Vue.js: https://vuejs.org/
.. _React: https://reactjs.org/
.. _node: https://nodejs.org/en/
.. _yarn: https://yarnpkg.com/en/
.. _moment.js: http://momentjs.com/
.. _ISO-8601: https://en.wikipedia.org/wiki/ISO_8601
