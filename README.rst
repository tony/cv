Tony Narlock's CV
=================
It's summer of 2019. 

v2 started! I'm still very open-minded about frontend frameworks.

Let's see what's the latest and greatest for both of these.
This time we're using typescript and wiring in webpack from the ground up.

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
