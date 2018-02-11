import React from 'react'
import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'
import { VisibleProjectFilter, VisibleActivityList } from '../containers/ActivityList'

const App = () => (
  <div>
    <VisibleProjectFilter />
    <AddTodo />
    <VisibleTodoList />
    <VisibleActivityList />
    <Footer />
  </div>
)

export default App
