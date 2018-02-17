Tony Narlock's CV
=================

Quickstart
----------

.. code-block:: bash

   $ yarn

   $ ./scripts/github.sh

   # for Vue.js
   $ cd vue/
   $ yarn
   $ npm run build

   # for Vue.js
   $ cd vue/
   $ yarn
   $ npm run build

   # for React
   $ cd react/
   $ yarn
   $ npm run build

Structure
--------

- `vue/ <vue/>`_: `Vue.js`_ version
- `react/ <react/>`_: `React`_ version
- `lib/ <lib/>`_: Common code (reducers/filters code, initial data collections)
- `scripts/ <scripts/>`_: GitHub Scraper
- `static/ <static/>`_: Static assets (images) shared across versions
- yarn.lock / package.json: Packages for *scripts/* files
- `data/ <data/>`_: initial data

  - *my_actors.json*: `Actors`_ noun, person, place, thing, etc.
  - *my_activities.json*: `Activities`_ verb, action, event, happening
    in relation to an *actor*

  - *scraped/*: data pulled from remote API's (such as
    *scripts/github.js*)

    - *gh_activities.json*: Pull requests for users *except* yourself / your
      own repos. Same format as *my_activities.json*, combined.
    - *gh_actors.json*: GitHub Repos. Same schema as
      *my_actors.json*), combined.

Concepts
--------

Common code reused between Vue/React versions
"""""""""""""""""""""""""""""""""""""""""""""

To make an accurate, holistic comparsion between React/Redux and Vue/Vuex.

Careful attention is made strike a balance between avoiding extra processing
steps and being greatest common chunks of code between the two.

`Yarn Workspaces`_ ensures both the Vue and React.js detect file updates and
always use the freshest "live" common code.

This is done via symlinks. Yarn Workspaces orchestrates what ``npm link`` /
``yarn link`` would have each user to manually, every time they cloned
the repo.

*lib/* is mapped to the ``cv-lib`` package, *data/* to ``cv-data``

Rationale:

- Using relative file links to ``../data`` and ``../lib`` from the
  *vue/package.json* and *react/package.json* would **copy** the package,
  which means the react/vue's file watching wouldn't detect changes made
  to *lib/* and *data/*, but rather *react/node_modules/cv-lib* and
  *react/node_modules/cv-data*, and so on. Hot updates wouldn't work
  if you modifed the real data, only the files that were copied to
  *node_modules/* (which you probably wouldn't edit directly).

  The data would be needlessly duplicated, and would grow stale if changes were
  made in development.
- ``npm link`` and ``yarn link`` don't stick between systems and can't be
  saved to ``package.json``/``yarn.lock``. This is the problem Yarn
  Workspaces / `lerna`_ solves.
- Personal experience with Yarn Workspaces on two projects that share common
  SCSS/JS code and packages. Workspaces have proven seemless and productive.

.. _Yarn Workspaces: https://yarnpkg.com/lang/en/docs/workspaces/
.. _lerna: https://github.com/lerna/lerna

Actor / Activity are just nouns / verbs
"""""""""""""""""""""""""""""""""""""""

The name actor/activity is picked to refer the same meaning throughout the
data, Vue.js, and React versions.

The notion of *actor* and *activity* is influenced by `Activity
Streams`_ 2.0 (May 2017). The schema's aren't strictly adhered to. Too
verbose, not needed.

An *actor* object is a noun/person/place/thing. Examples: A company (Social
Amp), or Software Library (libtmux).

An *activity* object is a verb/action/event/happening related to an *actor*.
Examples: Patch to an Open Source Project, Work at a Company, Volunteer at a
Website.

.. _Actors: https://www.w3.org/TR/activitystreams-core/#actors
.. _Activities: https://www.w3.org/TR/activitystreams-core/#activities
.. _Activity Streams: https://www.w3.org/TR/activitystreams-core/#introduction

Background
----------

In 2014, I wrote a `similar application <https://github.com/tony/github-exercise>`__
that became deprecated when GitHub's API changed. In 2018, I am experimenting with
both `Vue.js`_ and `React`_.

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

.. _GraphQL: http://graphql.org/

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

Observations Developing with Vue.js vs React (Feb 2018)
-------------------------------------------------------

React 16.2.0 and Vue.js 2.5.2

Property validation (minor)
"""""""""""""""""""""""""""

In React, `PropTypes`_ let you declaratively construct validation for your data. It emits warnings if the data is malformed. ``isRequired`` can be added to the type for required values. Critically, it can handle nested and arrays, and is composable:

.. code-block:: javascript

   const languageProp = {
     color: PropTypes.string.isRequired,
     name: PropTypes.string.isRequired,
   };

   const actorProp = {
     id: PropTypes.number.isRequired,
     name: PropTypes.string.isRequired,
     repo_url: PropTypes.string.isRequired,
     type: PropTypes.string.isRequired,
     url: PropTypes.string.isRequired,
     languages: PropTypes.arrayOf(
       PropTypes.shape(languageProp).isRequired
     ).isRequired,
   };

   const activityProp = {
     id: PropTypes.number.isRequired,
     component: PropTypes.string.isRequired,
     title: PropTypes.string.isRequired,
     description: PropTypes.string,
     actor: PropTypes.shape(actorProp).isRequired,
     created_date: PropTypes.string.isRequired,
     accepted_date: PropTypes.string,
     end_date: PropTypes.string
   };

In Vue.js, there also `Prop Validation`_ built-in. Like PropTypes, it emits warnings when an object doesn't fit. It can be used to declare defaults, and is inclined to have you use a ``validator`` `callback accepting the prop value as an argument for nested stuff <https://github.com/vuejs/vue/issues/7265>`__. Here's an example from Vue.js docs:

.. code-block:: javascript

   Vue.component('example', {
     props: {
       // basic type check (`null` means accept any type)
       propA: Number,
       // multiple possible types
       propB: [String, Number],
       // a required string
       propC: {
         type: String,
         required: true
       },
       // a number with default value
       propD: {
         type: Number,
         default: 100
       },
       // object/array defaults should be returned from a
       // factory function
       propE: {
         type: Object,
         default: function () {
           return { message: 'hello' }
         }
       },
       // custom validator function
       propF: {
         validator: function (value) {
           return value > 10
         }
       }
     }
   })

There is a third party plugin called `Vuelidate`_ that handles nested
models.

I prefer React's PropTypes for its superb execution. More compact, handles
arrays and nested objects granularly with ``.shape()``. Can be (de)-composed
(broken down into separate PropType variables, e.g. ``languageProp``,
``actorProp``, ``activityProp`` above, and used in decoupled components). A real gem.

.. _PropTypes: https://reactjs.org/docs/typechecking-with-proptypes.html
.. _Prop Validation:
   https://vuejs.org/v2/guide/components.html#Prop-Validation
.. _Vuelidate: https://monterail.github.io/vuelidate/

White spacing (minor)
"""""""""""""""""""""

React component templats automatically strips whitespace,
Vue.js adds whitespace, forcing you to pile on template tags
on the same line. (Because a new line creates a space). This is `discussed
in greater length
<https://reactjs.org/blog/2014/02/20/react-v0.9.html#jsx-whitespace>`__
in the React v0.9 release post.

With React.js, You explicitly have to create a whitespace by, at a
minimum, adding a ``<span>`` and spaces inside it. For example:

.. code-block:: html

   class LeftBox extends React.Component {
     render() {
       return (
         <div className="box">
           <h2>{this.props.activityType}</h2>
           <p>
           <small>Submitted
             <span> <Moment fromNow>{this.props.created_date}</Moment> </span>
              ({this.props.created_date})
           </small>
           </p>
         </div>
       )
     }
   }

See how I manually add the space in ``<span> <moment..``?

I prefer React's way. I like being explicit with whitespace, but also find
it helpful because I want to separate tags/text and not create space
automatically.

It's more tedious and verbose to trim whitespace *after* it occurs than it is to
declaratively add it when necessary.

There was an example in Vue.js were the whitespace was giving me a
concrete issue, but I don't remember it.

Performance: Render control
"""""""""""""""""""""""""""

On of the most important benefits React brings to the table with this is
``shouldComponentUpdate``.

The nature of controlling when components render in SPA is critical.
A central storage (vuex, redux) is going to trigger chain reactions across
a tree of components. They add up.

Vue doesn't make it as easy to control renders by hand, it's done
automatically [1]_.

React allows you to go under the hood and do it yourself. For any non-trivial,
enterprise-grade frontend application, the granularity ``shouldComponentUpdate``
will be indispensible.

Granularity: State control
""""""""""""""""""""""""""

Vue.js + Vuex has `getters`_, `actions`_ (which can be async), and `modules`_ to
split off state into different attributes (like ``combineReducers``).
*Mutation of the state is also permitted* via `mutations`_.

Redux's storage is fully immutable. Redux also has a way to manage complicated,
asynchronous states. `This video delves into what I mean
<https://youtu.be/Td-2D-_7Y2E?list=PLoYCgNOIyGABj2GQSlDRjgvXtqfDxKm5b&t=182>`_.

In practice, redux codebases can get pretty complex. The examples that
exist in open source seomtimes aren't good influences. It means more to
get a good grasp of redux and your own data flow, then build your redux
actions from scratch. Even simple examples like todo lists were
over-engineered, when really everything could have been done in one file.

Selectors: Computing / Composition / Filtering / Faceting data
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

Vuex allows ``getters`` (global computed properties) to be aware from each
other. This allows reuse / composability of siphoned/filter aspects of the data.
According to the creator of Vue.js, `it has the same performance
implications as reselect, too <https://github.com/vuejs/vuex/issues/144#issuecomment-209788079>`_.

With redux, there isn't a concept of passing around sibing
properties. You can easily be sent into a spiral of duplicated filtering
code. Thankfully, there is `reselect`_. It memoizes (caches) them and
gives you behavior comparable with Vuex getters. See the `Computer Derived
Data Recipe`_ in the redux docs.

.. _reselect: https://github.com/reactjs/reselect
.. _Computer Derived Data Recipe: https://redux.js.org/docs/recipes/ComputingDerivedData.html

Performance: Initial impressions
""""""""""""""""""""""""""""""""

As of 2018-02-11, the redux and react activity lists are renders far faster than
Vue.js. I haven't been able to rule out inefficiencies / optimizations
that could be taken on the vue app yet.

.. _Vue.js: https://vuejs.org/
.. _React: https://reactjs.org/
.. [1] https://github.com/vuejs/vue/issues/4255#issuecomment-261778207
.. _getters: https://vuex.vuejs.org/en/getters.html
.. _actions: https://vuex.vuejs.org/en/actions.html
.. _modules: https://vuex.vuejs.org/en/modules.html
.. _mutations: https://vuex.vuejs.org/en/mutations.html
