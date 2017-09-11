import React from 'react'
import { Link } from 'react-router-dom'

export default class RuffleCreated extends React.Component {
  render() {
    return (
      <div className={"col " + this.props.col}>
        <div className="card congrats-card">
          <div className="card-content">
            <h3 className="title">Congrats!</h3>
            <p>You have created a new raffle, please check its details. You can share your raffle using the following link:</p>
            <p><Link to={`/raffles/${this.props.raffleAddress}/show`}>{`${window.location.origin}/raffles/${this.props.raffleAddress}/show`}</Link></p>
          </div>
        </div>
      </div>
    )
  }
}
