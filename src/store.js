import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './rootReducer'

const createStoreWithMiddleware =
  compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : foo => foo
  )(createStore);

const store = createStoreWithMiddleware(
  combineReducers(
    {
      rootReducer
    }
  )
);

export default store;