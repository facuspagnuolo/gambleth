import Network from '../network'
import ErrorActions from './errors'
import * as ActionTypes from '../actiontypes'

const AccountActions = {
  findAccount() {
    return async function(dispatch) {
      try {
        const addresses = await Network.getAccounts()
        const mainAddress = addresses[0]
        dispatch(AccountActions.receiveAccount(mainAddress))
        dispatch(AccountActions.getEtherBalance(mainAddress))

      } catch(error) {
        dispatch(ErrorActions.showError(error))
      }
    }
  },

  getEtherBalance(address) {
    return async function(dispatch) {
      try {
        const balance = await Network.getBalance(address);
        dispatch(AccountActions.receiveEtherBalance(balance))
      } catch(error) {
        dispatch(ErrorActions.showError(error))
      }
    }
  },

  receiveAccount(address) {
    return { type: ActionTypes.RECEIVE_ACCOUNT, address }
  },

  createNewRaffle(address) {
    return { type: ActionTypes.CREATE_NEW_RAFFLE, address }
  },

  resetNewRaffle() {
    return { type: ActionTypes.CREATE_NEW_RAFFLE_RESET }
  },

  receiveEtherBalance(balance) {
    return { type: ActionTypes.RECEIVE_ETHER_BALANCE, balance }
  }
}

export default AccountActions
