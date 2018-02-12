import { combineReducers } from 'redux'
import activities from './activities'
import actors from './actors'
import selectedLanguages from './selectedLanguages'
import selectedActors from './selectedActors'
import visibilityFilter from './visibilityFilter'

const cvReducers = combineReducers({
  actors,
  selectedActors,
  activities,
  selectedLanguages,
  languages: (state = [], action) => state,
  visibilityFilter
})

export default cvReducers
