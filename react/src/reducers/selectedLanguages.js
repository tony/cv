const selectedLanguages = (state = [], action) => {
  switch (action.type) {
    case 'CHANGE_SELECTED_LANGUAGES':
      return action.value
    default:
      return state
  }
}

export default selectedLanguages
