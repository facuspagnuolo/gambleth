import React from 'react'

export default class Raffle extends React.Component {
  constructor(props){
    super(props)
    this.state = { raffle: this.props.raffle }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ raffle: nextProps.raffle })
  }

  render() {
    const raffle = this.state.raffle || {}
    return (
      <div className={"col " + this.props.col}>
        <div className="card">
          <div className="card-content">
            <div className="row valign-wrapper">
              <div className="col s10 valign"><h3 className="title">Raffle - {raffle.name}</h3></div>
              <div className="col s2 valign">{raffle.opened ?
                <span className="chip opened-chip">Opened</span> :
                <span className="chip closed-chip">Closed</span>}
              </div>
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
        </div>
      </div>
    )
  }
}
