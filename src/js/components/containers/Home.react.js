import React from 'react'
import RaffleForm from '../RaffleForm.react'
import RafflesList from '../RafflesList.react'

const Home = () => (
  <div className="row">
    <RaffleForm col="s12"/>
    <RafflesList col="s12"/>
  </div>
);

export default Home;
