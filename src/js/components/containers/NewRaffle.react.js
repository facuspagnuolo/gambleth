import React from 'react'
import RaffleCreated from '../RaffleCreated.react';

const NewRaffle = ({ match }) => (
  <div className="row">
    <RaffleCreated col="s12" raffleAddress={match.params.address}/>
  </div>
);

export default NewRaffle;
