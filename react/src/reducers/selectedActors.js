const selectedActors = (state = [], action) => {
  console.log('selectedActors reducer', state, action);
  switch (action.type) {
    case 'CHANGE_SELECTED_ACTORS':
      console.log(state);
      console.log(action);
      console.log([
        ...state, action.value
      ]);
      return action.value
    case 'ADD_TODO':
      return [
        ...state,
        {
          id: action.id,
          text: action.text,
          completed: false
        }
      ]
    case 'TOGGLE_TODO':
      return state.map(todo =>
        (todo.id === action.id)
          ? {...todo, completed: !todo.completed}
          : todo
      )
    default:
      return state
  }
}

export default selectedActors
