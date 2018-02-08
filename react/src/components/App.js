import React from 'react'
import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'
import ActivityList from '../containers/ActivityList'

const App = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <ActivityList />
    <Footer />
  </div>
)

export default App
