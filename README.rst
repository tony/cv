Tony Narlock's CV
=================

Quickstart
----------

- *vue/*: `Vue.js`_ version
- *react/*: `React`_ version
- *scripts/*: GitHub Scraper
- *static/*: Static assets (images) shared across versions
- *yarn.lock* / *package.json*: Packages for *scripts/* files
- *data/*: initial data

  - *my_actors.json*: `Actors`_ noun, person, place, thing, etc.
  - *my_activities.json*: `Activities`_ verb, action, event, happening
    in relation to an *actor*

  - *scraped/*: data pulled from remote API's (such as
    *scripts/github.js*)

    - *gh_activities.json*: Pull requests for users *except* yourself / your
      own repos. Same format as *my_activities.json*, combined.
    - *gh_actors.json*: GitHub Repos. Same schema as
      *my_actors.json*), combined.

The notion of *actor* and *activity* is the same idea as the terms in `Activity
Streams`_ 2.0 (May 2017). The schema's aren't strictly adhered to, only
influenced by it.

In the JSON file(s) in *data/*:

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

.. _Vue.js: https://vuejs.org/
.. _React: https://reactjs.org/
