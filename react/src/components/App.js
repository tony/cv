import React from 'react'
import { VisibleActivityList } from '../containers/ActivityList'
import Lenses from './Lenses.js'
import Charts from './Charts.js'


const App = () => (
  <div id="app">
    <div className='github-fork'>
      Made with <span role="img" aria-label="love">❤️</span> by <a href="https://www.git-pull.com" rel="noopener noreferrer" target="_blank">Tony Narlock</a>.<br/>
      Written in React (<a href="https://github.com/tony/cv" rel="noopener noreferrer" target="_blank">source</a>).<br/>
      <a href="https://cv-vue.git-pull.com">See also: Vue.js version</a>.
    </div>
    <div className="header">
      <h1>Tony Narlock's CV</h1>

      <p className="hidden"><em>
        Seeking remote, senior programming roles.
        I'm also available for <a href="https://www.git-pull.com/consulting/" rel="noopener noreferrer" target="_blank">consulting</a> and <a href="https://www.git-pull.com/mentoring/" rel="noopener noreferrer" target="_blank">mentoring</a>.
      </em></p>
      <p><em>
        Friendly note:
        I don't do technical screens. If this can't convince you, I'm probably not good enough for you
        <a href="https://www.git-pull.com/blog/2018/01/technical-screening.html" target="_blank" rel="noopener noreferrer" className="hidden footnote">[1]</a>.
      </em></p>

      <Charts />
      <Lenses />
    </div>
    <VisibleActivityList />
  </div>
)

export default App
