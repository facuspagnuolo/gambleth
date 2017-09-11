import React from 'react'
import thunkMiddleware from 'redux-thunk'
import error from './reducers/errors'
import network from './reducers/network'
import raffles from './reducers/raffles'
import account from './reducers/accounts'
import fetching from './reducers/fetching'
import { createStore, combineReducers, applyMiddleware } from 'redux'

const mainReducer = combineReducers({
  error,
  raffles,
  network,
  account,
  fetching,
});

const Store = createStore (
  mainReducer,
  applyMiddleware(thunkMiddleware)
);

export default Store;
