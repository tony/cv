The Making Of
=============

July 24th, 2019 - Saturday
--------------------------
React:
- Improvements to fetching activities / useEffect
- Introduce react-select and basic data representation

July 23rd, 2019 - Friday
------------------------
Update NPM packages all around

July 13th, 2019 - Saturday
--------------------------
Compilation issues

There would be errors inside of vue/ where it would says "files" weren't
found and no output emitted.

Fixed by:

- Closing all node processess ``killall -9 node``
- ``rm -rf ~/.cache/typescript ~/.npm``  (I actually did ``rm -rf
  ~/.cache`` since I'm on WSL, rm'ing all will crash Gnome on Linux.
- ``rm -rf node_modules && npm install`` in each dir
- ``npm install`` in src dir
- Now compilation works

Added a ``Makefile`` to clean *node_modules* and reinstall across all
projects. This should check to see if the setup works or not.

More headaches arisen after splitting search.ts in to search/search.ts.
Fixed by removing configFile option from ts-loader.

July 6th, 2019 - Saturday
-------------------------
Field names to camelcase

Actor.type -> Actor.actorType - Avoid overlap with typescript reserved words

Add typings for IActor

Add Actors to data module

Looked into doing normalizr again. Doesn't do much in practice since
there's already typings and excellent map/filter functions.

Split raw data from lib/data.ts to lib/data/raw.ts.

Added ActorTypes, ActivityTypes, Languages

July 5th, 2019 - Friday
-----------------------
Vue:

- Added basic lazy loaded listing of activities

  Very basic, like just text in a for loop

Angular:

- Surprise! Angular 8
- Wire in loading of data via paths

July 4th, 2019 - Thursday
-------------------------
webpack / babel torture day

Wire in initial JSON data import

Hours spent figuring out ``await import`` can't be ran at
the root level.  This goes a long way to explaining why JS/TS
isn't convenient as a backend language.

Thanks for codesplitting help:
- https://hackernoon.com/the-100-correct-way-to-split-your-chunks-with-webpack-f8a9df5b7758
- https://webpack.js.org/guides/code-splitting/

June 30th, 2019 - Sunday
------------------------
Work dealing with Wepback Environmental parameters
and default params. Passing in one param passes and object that overrides
each item in the default structure.

Updated both starters:
- https://github.com/tony/vue-typescript-vanilla-starter
- https://github.com/tony/react-typescript-vanilla-starter

Lots of fixes for prettier, typescript, making sure all pieces fit
together.

June 29th, 2019 - Saturday
--------------------------

react
"""""

Setup webpack config (typescript based)

There are many snags when configuring initially:

webpack consumes configs via --configFile rather than a positional
argument.

It doesn't raise errors very obviously

It's easy to generate a webpack.config.js from webpack.config.ts, have it
sit there, and be reread while you update.


June 28th, 2019 - Friday Evening
--------------------------------

To begin v2, I installed:

``sudo npm install -g create-react-app @vue/cli``

To look at references to wire in sass <-> typescript <-> build output
<-> hot reloading. And even copy paste from them (well technically
they wouldn't work, I'm converting them to typescript in-situ)

But selectively. v2's webpack configs are fully typed.

The reason why is at Peergrade I first tried typescript,
and eventually even used it for webpack configs, and haven't
looked back. So many interdependencies that can break in JS,
typescript makes sure everything fits together like tetris
(florian).


``yarn create react-app my-app --typescript``
``cd my-app``
``npm run eject``


``vue create my-project``
``vue config``:

.. code-block::

   Resolved path: /home/x/.vuerc
   {
      "useTaobaoRegistry": false,
      "packageManager": "npm",
      "presets": {
        "typescript + dart": {
          "useConfigFiles": true,
          "plugins": {
            "@vue/cli-plugin-babel": {},
            "@vue/cli-plugin-typescript": {
              "classComponent": true,
              "tsLint": true,
              "lintOn": [
                "save"
              ],
              "useTsWithBabel": true
            },
            "@vue/cli-plugin-pwa": {}
          },
          "vuex": true,
          "cssPreprocessor": "dart-sass"
        }
      }
    }

