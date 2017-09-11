import Network from './network'
import contract from 'truffle-contract'

const provider = Network.provider();

const EtherRaffle = contract(require('../../build/contracts/EtherRaffle.json'));
EtherRaffle.setProvider(provider);

const GamblethFactory = contract(require('../../build/contracts/GamblethFactory.json'));
GamblethFactory.setProvider(provider);

export {
  EtherRaffle,
  GamblethFactory,
}
