import { combineReducers } from 'redux'
import todos from './todos'
import activities from './activities'
import actors from './actors'
import visibilityFilter from './visibilityFilter'

const todoApp = combineReducers({
  todos,
  actors,
  activities,
  visibilityFilter
})

export default todoApp
