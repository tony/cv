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

