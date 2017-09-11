import React from 'react';
import Store from '../store'
import RaffleActions from '../actions/raffles'
import AccountActions from '../actions/accounts'
import { withRouter } from 'react-router-dom'

class RaffleForm extends React.Component {
  constructor(props){
    super(props)
    this.state = { name: '', owner: '', days: 0, price: 0 }
    this._handleSubmit = this._handleSubmit.bind(this)
    this._updateDays = this._updateDays.bind(this)
    this._updatePrice = this._updatePrice.bind(this)
    this._updateOwner = this._updateOwner.bind(this)
    this._updateName = this._updateName.bind(this)
  }

  componentDidMount() {
    Store.dispatch(AccountActions.findAccount());
    Store.subscribe(() => this._onChange());
  }

  render() {
    return (
      <div ref="ruffleForm" className={"col " + this.props.col}>
        <form className="card" onSubmit={this._handleSubmit}>
          <div className="card-content">
            <h3 className="title">Create your own raffle!</h3>
            <div className="row">
              <div className="input-field col s5">
                <label htmlFor="owner" className={this.state.owner ? 'active' : ''}>You (address)</label>
                <input value={this.state.owner} type="text" onChange={this._updateOwner} id="owner" disabled required/>
              </div>
              <div className="input-field col s4">
                <label htmlFor="name">Name of you raffle</label>
                <input value={this.state.name} type="text" onChange={this._updateName} id="name" required/>
              </div>
              <div className="input-field col s2">
                <label htmlFor="price">Price (wei)</label>
                <input onChange={this._updatePrice} type="number" id="price" required/>
              </div>
              <div className="input-field col s1">
                <label htmlFor="days">Days</label>
                <input onChange={this._updateDays} type="number" id="days" required/>
              </div>
            </div>
          </div>
          <div className="card-action">
            <button className="btn btn-primary">Create</button>
          </div>
        </form>
      </div>
    )
  }

  _handleSubmit(e) {
    e.preventDefault()
    const state = this.state
    Store.dispatch(RaffleActions.create(state.owner, state.name, state.days, state.price))
  }

  _updateOwner(e) {
    e.preventDefault();
    this.setState({ owner: e.target.value })
  }

  _updateName(e) {
    e.preventDefault();
    this.setState({ name: e.target.value })
  }

  _updatePrice(e) {
    e.preventDefault();
    this.setState({ price: e.target.value })
  }

  _updateDays(e) {
    e.preventDefault();
    this.setState({ days: e.target.value })
  }

  _onChange() {
    if(this.refs.ruffleForm) {
      const state = Store.getState();
      const newRaffleAddress = state.account.newRaffleAddress;
      if(newRaffleAddress) {
        this.props.history.push(`/raffles/${newRaffleAddress}/new`)
        Store.dispatch(AccountActions.resetNewRaffle())
      }
      else this.setState({ owner: state.account.address })
    }
  }
}

export default withRouter(RaffleForm)
