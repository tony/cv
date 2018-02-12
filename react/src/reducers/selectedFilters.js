const selectedFilters = (state = [], action) => {
  switch (action.type) {
    case 'CHANGE_SELECTED_FILTERS':
      return action.value
    default:
      return state
  }
}

export default selectedFilters
