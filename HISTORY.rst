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
