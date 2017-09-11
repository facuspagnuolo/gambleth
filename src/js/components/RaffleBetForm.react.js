import React from 'react'
import Store from '../store'
import Modal from './Modal.react'
import RaffleActions from '../actions/raffles'
import AccountActions from '../actions/accounts'

export default class RaffleBetForm extends React.Component {
  constructor(props){
    super(props)
    this.state = { bettor: '', account: null, raffle: this.props.raffle }
    this._handleSubmit = this._handleSubmit.bind(this)
    this._updateBettor = this._updateBettor.bind(this)
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(AccountActions.findAccount())
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ raffle: nextProps.raffle })
  }

  render() {
    const account = this.state.account
    const raffle = this.state.raffle || {}
    return (
      <div ref="raffleBetForm" className={"col " + this.props.col}>
        <form className="card" onSubmit={this._handleSubmit}>
          <div className="card-content">
            <h3 className="title">Buy your ticket!</h3>
            <div className="row">
              <div className="input-field col s6">
                <label htmlFor="bettor" className={this.state.bettor ? 'active' : ''}>You (address)</label>
                <input value={this.state.bettor} type="text" onChange={this._updateBettor} id="bettor" required/>
              </div>
              <div className="input-field col s6">
                { account ? <p className="balance-notification">Your balance: { account.balance }</p> : '' }
              </div>
            </div>
          </div>
          <div className="card-action">
            <div className="row">
              <div className="col s3 offset-s9">
                <button disabled={!raffle.opened} className="btn btn-primary">Buy Ticket!</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }

  _handleSubmit(e) {
    e.preventDefault()
    Store.dispatch(RaffleActions.bet(this.state.raffle.address, this.state.bettor))
  }

  _updateBettor(e) {
    e.preventDefault()
    this.setState({ bettor: e.target.value })
  }

  _onChange() {
    if(this.refs.raffleBetForm) {
      const state = Store.getState();
      this.setState({ account: state.account, bettor: state.account.address });
    }
  }
}
