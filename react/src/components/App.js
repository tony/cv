import React from 'react'
import { VisibleActorFilter, VisibleActivityList } from '../containers/ActivityList'
import Graphs from './Graphs.js'


const App = () => (
  <div>
    <VisibleActorFilter />
    <VisibleActivityList />
    <Graphs />
  </div>
)

export default App
