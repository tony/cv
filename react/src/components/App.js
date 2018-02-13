import React from 'react'
import { VisibleActorFilter, VisibleActivityList } from '../containers/ActivityList'
import Graphs from './Graphs.js'


const App = () => (
  <div className="header">
    <h1>Tony Narlock's CV</h1>

    <p><em>Friendly note:
      I don't do technical screens<a href="https://www.git-pull.com/blog/2018/01/technical-screening.html" target="_blank" rel="noopener noreferrer" class="hidden footnote">[1]</a>.
      Seeking remote, senior programming roles.
      I'm also available for <a href="https://www.git-pull.com/consulting/" rel="noopener noreferrer" target="_blank">consulting</a> and
      <a href="https://www.git-pull.com/mentoring/" rel="noopener noreferrer" target="_blank">mentoring</a>.</em></p>

    <Graphs />
    <VisibleActorFilter />
    <VisibleActivityList />
  </div>
)

export default App
