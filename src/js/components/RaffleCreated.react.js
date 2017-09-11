import React from 'react'
import { Link } from 'react-router-dom'

const RuffleCreated = () => (
  <div className={"col " + this.props.col}>
    <div className="card congrats-card">
      <div className="card-content">
        <span className="card-title">Congrats!</span>
        <p>You have created a new raffle. Please check your raffle details.</p>
        <p>Share your raffle using the following link:
          <Link to={`/raffles/${this.props.raffleAddress}/show`}>
            {`${window.location.origin}/raffles/${this.props.raffleAddress}/show`}
          </Link>
        </p>
      </div>
    </div>
  </div>
)

export default RuffleCreated
