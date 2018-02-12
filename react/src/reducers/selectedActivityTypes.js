const selectedActivityTypes = (state = [], action) => {
  switch (action.type) {
    case 'CHANGE_SELECTED_ACTIVITY_TYPES':
      return action.value
    default:
      return state
  }
}

export default selectedActivityTypes
