pragma solidity ^0.4.11;

import './EtherRaffle.sol';

contract GamblethFactory {
  function GamblethFactory() {
  }

  event RaffleCreated(uint256 numberOfDays, uint256 price, address raffleAddress);

  function createRaffle(string _name, uint256 _numberOfDays, uint256 _price) external returns (address) {
    require(_price > 0);
    require(_numberOfDays > 0);

    EtherRaffle raffle = new EtherRaffle(_name, _numberOfDays, _price);
    raffle.transferOwnership(msg.sender);
    RaffleCreated(_numberOfDays, _price, raffle);

    return raffle;
  }
}
