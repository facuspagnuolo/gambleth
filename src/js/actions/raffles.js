import ErrorActions from './errors'
import AccountActions from './accounts'
import FetchingActions from './fetching'
import * as ActionTypes from '../actiontypes'
import { GAS } from '../constants'
import { EtherRaffle, GamblethFactory } from '../contracts'

const RaffleActions = {

  findAll() {
    return async function(dispatch) {
      try {
        // TODO: use deployed
        const factory = await GamblethFactory.at('0x4af544ebf69f95f21f3e2218662f5327591e243c')
        const events = factory.RaffleCreated({}, { fromBlock: 1651911, toBlock: 'latest' });
        events.watch(function(error, result) {
          if(error) ErrorActions.showError(error)
          else dispatch(RaffleActions.add(result.args.raffleAddress))
        })
      } catch(error) {
        dispatch(ErrorActions.showError(error))
      }
    }
  },

  find(address) {
    return async function(dispatch) {
      try {
        const raffle = await EtherRaffle.at(address)
        dispatch(RaffleActions.receive(raffle))
      } catch(error) {
        dispatch(ErrorActions.showError(error))
      }
    }
  },

  create(owner, name, days, price) {
    return async function(dispatch) {
      console.log(`Creating raffle ${name} for ${days} days costing ${price}, by owner ${owner}`);
      dispatch(FetchingActions.start('creating your ethereum raffle contract'))
      try {
        // TODO: use deployed
        const factory = await GamblethFactory.at('0x4af544ebf69f95f21f3e2218662f5327591e243c')
        const transaction = await factory.createRaffle(name, days, price, { from: owner, gas: GAS })
        const raffleAddress = transaction.logs[0].args.raffleAddress;
        dispatch(RaffleActions.add(raffleAddress))
        dispatch(AccountActions.createNewRaffle(raffleAddress))
        dispatch(FetchingActions.stop())
      } catch(error) {
        dispatch(ErrorActions.showError(error))
      }
    }
  },

  bet(raffleAddress, bettor) {
    return async function(dispatch) {
      console.log(`Bettor ${bettor} buying tickets for raffle ${raffleAddress}`);
      dispatch(FetchingActions.start('buying tickets'))
      try {
        const raffle = await EtherRaffle.at(raffleAddress)
        const value = await raffle.price()
        const transaction = await raffle.sendTransaction({ from: bettor, value: value, gas: GAS })
        dispatch(AccountActions.getEtherBalance(bettor))
        dispatch(RaffleActions.receive(raffle))
        dispatch(FetchingActions.stop())
      } catch (error) {
        dispatch(ErrorActions.showError(error))
      }
    }
  },


  add(address) {
    return async function(dispatch) {
      try {
        const raffle = await EtherRaffle.at(address)
        const raffleInformation = await RaffleActions._buildRaffleInformation(raffle)
        dispatch({ type: ActionTypes.ADD_RAFFLE, raffle: raffleInformation })
      } catch(error) {
        dispatch(ErrorActions.showError(error))
      }
    }
  },

  receive(raffle) {
    return async function(dispatch) {
      try {
        const raffleInformation = await RaffleActions._buildRaffleInformation(raffle)
        dispatch({ type: ActionTypes.RECEIVE_RAFFLE, raffle: raffleInformation })
      } catch(error) {
        dispatch(ErrorActions.showError(error))
      }
    }
  },

  async _buildRaffleInformation(raffle) {
    return {
      address: raffle.address,
      name: await raffle.name(),
      owner: await raffle.owner(),
      opened: await raffle.opened(),
      pot: (await raffle.pot()).toString(),
      price: (await raffle.price()).toString(),
      days: (await raffle.numberOfDays()).toString(),
      endingDate: (await raffle.endingDate()).toString(),
      canBeClosed: await raffle.canBeClosed(),
    }
  }
}

export default RaffleActions
