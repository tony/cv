import { combineReducers } from 'redux'
import activities from './activities'
import actors from './actors'
import selectedActors from './selectedActors'
import visibilityFilter from './visibilityFilter'

const cvReducers = combineReducers({
  actors,
  selectedActors,
  activities,
  visibilityFilter
})

export default cvReducers
