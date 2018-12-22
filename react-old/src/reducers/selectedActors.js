const selectedActors = (state = [], action) => {
  switch (action.type) {
    case 'CHANGE_SELECTED_ACTORS':
      return action.value
    default:
      return state
  }
}

export default selectedActors
