import React from 'react';
import { VisibleActivityList } from '../containers/ActivityList';
import Lenses from './Lenses.js';
import Charts from './Charts.js';

const App = () => (
  <div id="app">
    <div id="v2-notice">
      Psst. I'm working on something new!{' '}
      <a href="https://cv-react-v2.git-pull.com">Take a peek?</a>
    </div>
    <div className="github-fork">
      <span className="author">
        Made with{' '}
        <span role="img" aria-label="love">
          ❤️
        </span>{' '}
        by{' '}
        <a
          href="https://www.git-pull.com"
          rel="noopener noreferrer"
          target="_blank"
        >
          Tony Narlock
        </a>
        .
      </span>
      <br />
      Written in React (
      <a
        href="https://github.com/tony/cv/tree/v1/react"
        rel="noopener noreferrer"
        target="_blank"
      >
        source
      </a>
      ).
      <br />
      See also: <a href="https://cv-vue.git-pull.com">Vue.js version</a>.
    </div>
    <div className="header">
      <h1>Tony Narlock's CV</h1>
      <p>
        <em>
          I appreciate when hiring managers look at my contributions and
          projects in lieu of technical screens, that let's us both know my
          strengths match the role!
        </em>
      </p>

      <Charts />
      <Lenses />
    </div>
    <VisibleActivityList />
  </div>
);

export default App;
