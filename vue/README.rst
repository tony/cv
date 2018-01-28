Design notes
============

This single page application (SPA) is based in `vue.js`_, ES6. It uses `vuex`_ as a global data singleton, and a
as well as `Single File Components
<https://vuejs.org/v2/guide/single-file-components.html>`__.

Everything is tied together via `webpack <https://webpack.js.org/>`__.

Prerequisites: To build, ensure you have `node`_ + `yarn`_ installed.

Development: ``$ yarn``, ``$ npm run dev``, and go to http://localhost:8080

- Since the items follow the same container format and styling,
  the components/Row.vue is used as a `named slot
  <https://vuejs.org/v2/guide/components.html#Named-Slots>`_

.. _vue.js: https://vuejs.org/
.. _vuex: https://vuex.vuejs.org/en/
.. _node: https://nodejs.org/en/
.. _yarn: https://yarnpkg.com/en/
