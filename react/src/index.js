import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import todoApp from './reducers';
import registerServiceWorker from './registerServiceWorker';
import { addTodo } from './actions';

let store = createStore(todoApp)

store.dispatch(addTodo('hi'));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
