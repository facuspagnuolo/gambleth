import React from 'react'
import Store from '../store'
import Modal from './Modal.react'
import Navbar from './Navbar.react'
import Home from './containers/Home.react'
import NewRaffle from './containers/NewRaffle.react'
import ShowRaffle from './containers/ShowRaffle.react'
import NetworkActions from '../actions/network'
import { Switch, Route } from 'react-router-dom'

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state = { error: null, connected: null, couldAccessAccount: null, fetching: false }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(NetworkActions.checkConnection())
    Store.dispatch(NetworkActions.checkAccountAccess())
  }

  render() {
    const connected = this.state.connected
    const couldAccessAccount = this.state.couldAccessAccount
    const fetching = connected && couldAccessAccount && this.state.fetching !== null

    return (
      <div ref="app">
        <Navbar/>
        <div className="main-container container">
          <div id="errors">{this.state.error ? this.state.error.message : ''}</div>
          <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/raffles/:address/new" exact component={NewRaffle}/>
            <Route path="/raffles/:address/show" exact component={ShowRaffle}/>
          </Switch>
        </div>
        <Modal open={fetching} progressBar message={this.state.fetching}/>
        <Modal dark open={!connected} message={'Please access using MIST or Metamask'}/>
        <Modal dark open={connected && !couldAccessAccount} message={'Please enable your account'}/>
      </div>
    )
  }

  _onChange() {
    const state = Store.getState()
    if(this.refs.app) this.setState({
      error: state.error,
      fetching: state.fetching,
      connected: state.network.connected,
      couldAccessAccount: state.network.couldAccessAccount
    })
  }
}
