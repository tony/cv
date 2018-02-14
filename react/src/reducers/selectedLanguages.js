const selectedLanguages = (state = [], action) => {
  switch (action.type) {
    case 'CHANGE_SELECTED_LANGUAGES':
      return action.value
    case 'ADD_SELECTED_LANGUAGE':
      let languages = '';
      const language = action.value;
      if (state.indexOf(language) > -1) {
        languages = state;
      } else if (state.length) {
        languages = state + ',' + language;
      } else {
        languages = language;
      }
      return languages

    default:
      return state
  }
}

export default selectedLanguages
