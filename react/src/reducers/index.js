import { combineReducers } from 'redux'
import activities from './activities'
import actors from './actors'
import selectedLanguages from './selectedLanguages'
import selectedActivityTypes from './selectedActivityTypes'
import selectedActors from './selectedActors'
import selectedFilters from './selectedFilters'

const cvReducers = combineReducers({
  actors,
  selectedActors,
  activities,
  languages: (state = [], action) => state,
  selectedLanguages,
  activityTypes: (state = [], action) => state,
  selectedActivityTypes,
  filters: (state = [], action) => state,
  selectedFilters,
})

export default cvReducers
