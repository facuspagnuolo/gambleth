import React from 'react'
import Store from '../store'
import { Link } from 'react-router-dom'
import RaffleActions from '../actions/raffles'

export default class RafflesList extends React.Component {
  constructor(props){
    super(props)
    this.state = { raffles: [] }
  }

  componentDidMount() {
    this.setState({ raffles: [] })
    Store.subscribe(() => this._onChange())
    Store.dispatch(RaffleActions.findAll())
  }

  render() {
    return (
      <div ref="rafflesList" className={"col " + this.props.col}>
        <div className="card raffles-list">
          <div className="card-content">
            <h3 className="title">Raffles List</h3>
            { this.state.raffles.length === 0 ? <em>Loading...</em> : <ul className="collection">{this._buildRafflesList()}</ul>}
          </div>
        </div>
      </div>
    )
  }

  _buildRafflesList() {
    return this.state.raffles.map(raffle => {
      let chipTitle = raffle.opened ? 'opened' : 'closed'
      if(raffle.canBeClosed) chipTitle = 'can be closed'
      const chipClass = chipTitle.replace(/\s+/g, '-')
      return (
        <li className="collection-item" key={raffle.address}>
          <div>
            <Link to={`/raffles/${raffle.address}/show`}>{raffle.name}</Link> - $ {raffle.pot} (wei)
            <span className={`chip secondary-content ${chipClass}-chip`}>{chipTitle}</span>
          </div>
        </li>
      )
    })
  }

  _onChange() {
    if(this.refs.rafflesList) {
      const state = Store.getState();
      if(state.raffles.list !== this.state.raffles) this.setState({ raffles: state.raffles.list });
    }
  }
}
