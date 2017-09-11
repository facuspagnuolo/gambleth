import React from 'react';
import * as ActionTypes from '../actiontypes'

const initialState = { address: '', balance: 0, raffleAddress: null };

const AccountsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_ACCOUNT:
      return Object.assign({}, state, { address: action.address });
    case ActionTypes.RECEIVE_ETHER_BALANCE:
      return Object.assign({}, state, { balance: action.balance.toString() });
    case ActionTypes.CREATE_NEW_RAFFLE:
      return Object.assign({}, state, { raffleAddress: action.address });
    case ActionTypes.CREATE_NEW_RAFFLE_RESET:
      return Object.assign({}, state, { raffleAddress: null });
    default:
      return state
  }
};

export default AccountsReducer;
