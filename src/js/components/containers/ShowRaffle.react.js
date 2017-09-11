import React from 'react'
import Store from '../../store'
import Modal from '../Modal.react'
import Raffle from '../Raffle.react'
import RaffleBetForm from '../RaffleBetForm.react'
import RaffleActions from '../../actions/raffles'

export default class ShowRaffle extends React.Component {
  constructor(props){
    super(props)
    this.state = { raffle: null, raffleAddress: this.props.match.params.address }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(RaffleActions.find(this.state.raffleAddress))
  }

  render () {
    const loading = this.state.raffle === null
    return (
      <div ref="raffle">
        <Raffle col="s12" raffle={this.state.raffle}/>
        <RaffleBetForm col="s12" raffle={this.state.raffle}/>
        <Modal open={loading} progressBar message={'loading raffle data...'}/>
      </div>
    )
  }

  _onChange() {
    if(this.refs.raffle) {
      const state = Store.getState();
      this.setState({ raffle: state.raffles.raffle });
    }
  }
}
