pragma solidity ^0.4.11;

import '../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol';
import '../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol';

contract EtherRaffle is Ownable {
  using SafeMath for uint256;

  bool public opened;
  string public name;
  address public winner;
  uint256 public pot;
  uint256 public price;
  uint256 public endingDate;
  uint256 public numberOfDays;
  address[] public bettors;

  event Bet(address bettor, uint256 position, uint256 pot);
  event Close(uint256 pot, uint256 when);

  function EtherRaffle(string _name, uint256 _numberOfDays, uint256 _price) {
    if(_price <= 0) return;
    if(_numberOfDays <= 0) return;

    pot = 0;
    name = _name;
    opened = true;
    price = _price;
    numberOfDays = _numberOfDays;
    endingDate = now + numberOfDays * 1 days;
  }

  function reachedEndDate() constant returns(bool) {
    return now >= endingDate;
  }

  function canBeClosed() constant returns(bool) {
    return opened && reachedEndDate();
  }

  function randomBettorPosition() constant returns(uint256) {
    return uint256(sha3(now)) % bettors.length;
  }

  function countBettor(address _bettor) constant returns (uint256) {
    uint256 times = 0;
    for (uint256 i = 0; i < bettors.length; i++) if (bettors[i] == _bettor) times++;
    return times;
  }

  function () payable {
    address _bettor = msg.sender;
    uint256 _value = msg.value;

    require(opened);
    require(_value == price);
    require(!reachedEndDate());

    pot = pot.add(_value);
    bettors.push(_bettor);
    Bet(_bettor, bettors.length, pot);
  }

  function close() returns(bool) {
    require(canBeClosed());

    opened = false;
    if(bettors.length > 0) {
      winner = bettors[randomBettorPosition()];
      winner.transfer(pot);
    }

    Close(pot, now);
    return true;
  }
}
