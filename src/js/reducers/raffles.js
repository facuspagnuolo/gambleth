import React from 'react';
import * as ActionTypes from '../actiontypes'

const initialState = { list: [], raffle: null }

const RafflesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.ADD_RAFFLE:
      let raffles = state.list;
      return Object.assign({}, state, { list: [action.raffle].concat(raffles) })
    case ActionTypes.RESET_RAFFLE:
      return Object.assign({}, state, { raffle: null })
    case ActionTypes.RECEIVE_RAFFLE:
      return Object.assign({}, state, { raffle: action.raffle })
    default:
      return state
  }
};

export default RafflesReducer;
