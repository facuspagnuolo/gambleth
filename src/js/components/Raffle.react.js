import React from 'react'
import Store from '../store'
import RaffleActions from '../actions/raffles'

export default class Raffle extends React.Component {
  constructor(props){
    super(props)
    this.state = { raffle: this.props.raffle, closer: '' }
    this._closeRaffle = this._closeRaffle.bind(this)
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ raffle: nextProps.raffle })
  }

  render() {
    const raffle = this.state.raffle || {}
    let chipTitle = raffle.opened ? 'opened' : 'closed'
    if(raffle.canBeClosed) chipTitle = 'can be closed'
    const chipClass = chipTitle.replace(/\s+/g, '-')
    return (
      <div className={"col " + this.props.col}>
        <div className="card">
          <div className="card-content">
            <div className="row valign-wrapper">
              <div className="col s10 valign"><h3 className="title">Raffle - {raffle.name}</h3></div>
              <div className="col s2 valign"><span className={`chip ${chipClass}-chip`}>{chipTitle}</span></div>
            </div>
            <div className="row">
              <div className="input-field col s6">
                <label className="active">Raffle (address)</label>
                <p className="labeled">{raffle.address}</p>
              </div>
              <div className="input-field col s6">
                <label className="active">Owner (address)</label>
                <p className="labeled">{raffle.owner}</p>
              </div>
              <div className="input-field col s3">
                <label className="active">End at</label>
                <p className="labeled">{raffle.endingDate}</p>
              </div>
              <div className="input-field col s3">
                <label className="active">Ticket Price (wei)</label>
                <p className="labeled">{raffle.price}</p>
              </div>
              <div className="input-field col s3">
                <label className="active">Pot Prize (wei)</label>
                <p className="labeled">{raffle.pot}</p>
              </div>
              <div className="input-field col s3">
                <label className="active">Can be closed?</label>
                <p className="labeled">{raffle.canBeClosed ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
          <div className="card-action">
            <button disabled={!raffle.canBeClosed} onClick={this._closeRaffle} className="btn btn-primary">Draw!</button>
          </div>
        </div>
      </div>
    )
  }

  _closeRaffle(e) {
    e.preventDefault()
    Store.dispatch(RaffleActions.close(this.state.raffle.address, this.state.closer))
  }

  _onChange() {
    const state = Store.getState();
    this.setState({ closer: state.account.address });
  }
}
