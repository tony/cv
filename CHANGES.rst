v2
--

- TypeScript for Vue and React
- Clean projects from scratch

New starter scripts:

- React: Use create-react-app --typescript, 2.1.1
- Vue: Use @vue/cli 3.2.1

Both of the above bundle Webpack v4 and were configured
to use typescript out of the box.

react: react-select v2

FAQ
===

Why was /lib copied to /react/src/lib/
""""""""""""""""""""""""""""""""""""""

This is due to a limitation in create-react-app.

Even symlinks don't work, since create-react-app won't
recognize .ts files and run them through tsc.

https://github.com/facebook/create-react-app/issues/1333
https://github.com/facebook/create-react-app/issues/3685
https://github.com/facebook/create-react-app/issues/4161

There is a workaround (ejecting the app) but the preference for this project is
to keep configs simple as possible to benefit from the upstream changes
from create-react-app and @vue/cli.
