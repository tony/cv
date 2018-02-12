import { combineReducers } from 'redux'
import activities from './activities'
import actors from './actors'
import selectedLanguages from './selectedLanguages'
import selectedActivityTypes from './selectedActivityTypes'
import selectedActors from './selectedActors'
import visibilityFilter from './visibilityFilter'

const cvReducers = combineReducers({
  actors,
  selectedActors,
  activities,
  languages: (state = [], action) => state,
  selectedLanguages,
  activityTypes: (state = [], action) => state,
  selectedActivityTypes,
  visibilityFilter
})

export default cvReducers
