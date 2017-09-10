const BigNumber = web3.BigNumber;
import moment from 'moment';
import increaseTime from './helpers/increaseTime';

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const EtherRaffle = artifacts.require('EtherRaffle');

contract('EtherRaffle', accounts => {
  describe('given an ether lottery contract', async function () {
    let etherRaffle = null;
    const owner = accounts[0];
    const days = new BigNumber(10);
    const price = new BigNumber(10);

    beforeEach(async function() {
      etherRaffle = await EtherRaffle.new("my raffle", days, price, { from: owner });
    });

    it('has a name, an owner, a price and a number of days', async function () {
      (await etherRaffle.owner()).should.be.equal(owner);
      (await etherRaffle.name()).should.be.equal("my raffle");
      (await etherRaffle.price()).should.be.bignumber.equal(price);
      (await etherRaffle.numberOfDays()).should.be.bignumber.equal(days);
    });

    it('is opened, has not reached end date and cannot be closed', async function () {
      (await etherRaffle.opened()).should.be.true;
      (await etherRaffle.reachedEndDate()).should.be.false;
      (await etherRaffle.canBeClosed()).should.be.false;
    });

    describe('when some ether is transferred to the contract', async function() {
      let transaction = null;
      const bettor = owner;

      describe('when the the amount of ether is equal to the set price', async function() {
        const value = new BigNumber(10);

        it('adds that bettor and increments the balance of the contract', async function () {
          const bettorPreBalance = web3.eth.getBalance(bettor);
          const contractPreEtherBalance = web3.eth.getBalance(etherRaffle.address);

          transaction = await etherRaffle.sendTransaction({ from: bettor, value: value, gasPrice: 0 });
          const pot = await etherRaffle.pot();
          const countBettor = await etherRaffle.countBettor(bettor);

          pot.should.be.bignumber.equal(value);
          countBettor.should.be.bignumber.equal(new BigNumber(1));
          web3.eth.getBalance(bettor).should.bignumber.be.equal(bettorPreBalance.minus(value));
          web3.eth.getBalance(etherRaffle.address).should.bignumber.be.equal(contractPreEtherBalance.plus(value));
          transaction.logs[0].event.should.be.equal('Bet');
        });

        describe('when the same bettor bets again', async function() {
          beforeEach(async function() {
            transaction = await etherRaffle.sendTransaction({ from: bettor, value: value });
          });

          it('adds that bettor again and increments the balance of the contract', async function () {
            const bettorPreBalance = web3.eth.getBalance(bettor);
            const contractPreEtherBalance = web3.eth.getBalance(etherRaffle.address);

            transaction = await etherRaffle.sendTransaction({ from: bettor, value: value, gasPrice: 0 });
            const pot = await etherRaffle.pot();
            const countBettor = await etherRaffle.countBettor(bettor);

            pot.should.be.bignumber.equal(value.times(2));
            countBettor.should.be.bignumber.equal(new BigNumber(2));
            web3.eth.getBalance(bettor).should.bignumber.be.equal(bettorPreBalance.minus(value));
            web3.eth.getBalance(etherRaffle.address).should.bignumber.be.equal(contractPreEtherBalance.plus(value));
            transaction.logs[0].event.should.be.equal('Bet');
          });
        });

        describe('when another bettor bets for the same ruffle', async function() {
          const anotherBettor = accounts[1];

          beforeEach(async function() {
            transaction = await etherRaffle.sendTransaction({ from: bettor, value: value });
          });

          it('adds that bettor and increments the balance of the contract', async function () {
            const bettorPreBalance = web3.eth.getBalance(anotherBettor);
            const contractPreEtherBalance = web3.eth.getBalance(etherRaffle.address);

            transaction = await etherRaffle.sendTransaction({ from: anotherBettor, value: value, gasPrice: 0 });
            const pot = await etherRaffle.pot();
            const countBettor = await etherRaffle.countBettor(anotherBettor);

            pot.should.be.bignumber.equal(value.times(2));
            countBettor.should.be.bignumber.equal(new BigNumber(1));
            web3.eth.getBalance(anotherBettor).should.bignumber.be.equal(bettorPreBalance.minus(value));
            web3.eth.getBalance(etherRaffle.address).should.bignumber.be.equal(contractPreEtherBalance.plus(value));
            transaction.logs[0].event.should.be.equal('Bet');
          });
        });
      });

      describe('when the the amount of ether is greater than the set price', async function() {
        const value = new BigNumber(11);

        it('does not add that bettor and does not increment the balance of the contract', async function () {
          const bettorPreBalance = web3.eth.getBalance(bettor);
          const contractPreEtherBalance = web3.eth.getBalance(etherRaffle.address);

          try {
            transaction = await etherRaffle.sendTransaction({ from: bettor, value: value, gasPrice: 0 });
          } catch (error) {
            error.message.search('invalid opcode').should.be.above(0);
          }
          const pot = await etherRaffle.pot();
          const countBettor = await etherRaffle.countBettor(bettor);

          pot.should.be.bignumber.equal(new BigNumber(0));
          countBettor.should.be.bignumber.equal(new BigNumber(0));
          web3.eth.getBalance(bettor).should.bignumber.be.equal(bettorPreBalance);
          web3.eth.getBalance(etherRaffle.address).should.bignumber.be.equal(contractPreEtherBalance);
        });
      });

      describe('when the the amount of ether is less than the set price', async function() {
        const value = new BigNumber(9);

        it('does not add that bettor and does not increment the balance of the contract', async function () {
          const bettorPreBalance = web3.eth.getBalance(bettor);
          const contractPreEtherBalance = web3.eth.getBalance(etherRaffle.address);

          try {
            transaction = await etherRaffle.sendTransaction({ from: bettor, value: value, gasPrice: 0 });
          } catch (error) {
            error.message.search('invalid opcode').should.be.above(0);
          }
          const pot = await etherRaffle.pot();
          const countBettor = await etherRaffle.countBettor(bettor);

          pot.should.be.bignumber.equal(new BigNumber(0));
          countBettor.should.be.bignumber.equal(new BigNumber(0));
          web3.eth.getBalance(bettor).should.bignumber.be.equal(bettorPreBalance);
          web3.eth.getBalance(etherRaffle.address).should.bignumber.be.equal(contractPreEtherBalance);
        });
      });
    });

    describe('when someone tries to close a raffle', async function() {
      let transaction = null;
      const sender = accounts[0];

      describe('when some people have bet', async function() {
        const bettor = accounts[0];
        const anotherBettor = accounts[1];

        beforeEach(async function() {
          await etherRaffle.sendTransaction({ from: bettor, value: price });
          await etherRaffle.sendTransaction({ from: anotherBettor, value: price });
        });

        describe('when now is equal to the end datetime', async function () {
          beforeEach(async function () {
            await increaseTime(moment.duration(10, 'day').asSeconds())
          });

          it('closes the raffle and picks a winner', async function () {
            const bettorPreBalance = web3.eth.getBalance(bettor);
            const anotherBettorPreBalance = web3.eth.getBalance(anotherBettor);

            transaction = await etherRaffle.close({ from: sender, gasPrice: 0 });
            const bettorPosBalance = web3.eth.getBalance(bettor);
            const anotherBettorPosBalance = web3.eth.getBalance(anotherBettor);
            const pot = await etherRaffle.pot();
            const opened = await etherRaffle.opened();
            const winner = await etherRaffle.winner();

            opened.should.be.false;
            winner.should.not.be.equal(0x0);
            pot.should.be.bignumber.equal(price.times(2));
            transaction.logs[0].event.should.be.equal('Close');
            web3.eth.getBalance(etherRaffle.address).should.be.bignumber.equal(new BigNumber(0));
            bettorPosBalance.plus(anotherBettorPosBalance).should.be.bignumber.equal(bettorPreBalance.plus(anotherBettorPreBalance).plus(pot));
          });
        });

        describe('when now is equal to a second after the end datetime', async function () {
          beforeEach(async function () {
            await increaseTime(moment.duration(10, 'day').asSeconds() + 1)
          });

          it('closes the raffle and picks a winner', async function () {
            const bettorPreBalance = web3.eth.getBalance(bettor);
            const anotherBettorPreBalance = web3.eth.getBalance(anotherBettor);

            transaction = await etherRaffle.close({ from: sender, gasPrice: 0 });
            const bettorPosBalance = web3.eth.getBalance(bettor);
            const anotherBettorPosBalance = web3.eth.getBalance(anotherBettor);
            const pot = await etherRaffle.pot();
            const opened = await etherRaffle.opened();
            const winner = await etherRaffle.winner();

            opened.should.be.false;
            winner.should.not.be.equal(0x0);
            pot.should.be.bignumber.equal(price.times(2));
            transaction.logs[0].event.should.be.equal('Close');
            web3.eth.getBalance(etherRaffle.address).should.be.bignumber.equal(new BigNumber(0));
            bettorPosBalance.plus(anotherBettorPosBalance).should.be.bignumber.equal(bettorPreBalance.plus(anotherBettorPreBalance).plus(pot));
          });
        });

        describe('when now is equal to a second before the end datetime', async function () {
          beforeEach(async function () {
            await increaseTime(moment.duration(10, 'day').asSeconds() - 1)
          });

          it('does not close the raffle', async function () {
            const bettorPreBalance = web3.eth.getBalance(bettor);
            const anotherBettorPreBalance = web3.eth.getBalance(anotherBettor);

            try {
              transaction = await etherRaffle.close({ from: sender, gasPrice: 0 });
            } catch (error) {
              error.message.search('invalid opcode').should.be.above(0);
            }
            const pot = await etherRaffle.pot();
            const opened = await etherRaffle.opened();
            const winner = await etherRaffle.winner();

            opened.should.be.true;
            pot.should.be.bignumber.equal(price.times(2));
            winner.should.be.equal('0x0000000000000000000000000000000000000000');
            web3.eth.getBalance(bettor).should.be.bignumber.equal(bettorPreBalance);
            web3.eth.getBalance(anotherBettor).should.be.bignumber.equal(anotherBettorPreBalance);
            web3.eth.getBalance(etherRaffle.address).should.bignumber.be.equal(price.times(2));
          });
        });
      });

      describe('when no one has bet', async function() {

        describe('when now is equal to the end datetime', async function () {
          beforeEach(async function () {
            await increaseTime(moment.duration(10, 'day').asSeconds())
          });

          it('closes the raffle', async function () {
            transaction = await etherRaffle.close({ from: sender, gasPrice: 0 });
            const pot = await etherRaffle.pot();
            const opened = await etherRaffle.opened();
            const winner = await etherRaffle.winner();

            opened.should.be.false;
            pot.should.be.bignumber.equal(new BigNumber(0));
            winner.should.be.equal('0x0000000000000000000000000000000000000000');
            web3.eth.getBalance(etherRaffle.address).should.bignumber.be.equal(new BigNumber(0));
            transaction.logs[0].event.should.be.equal('Close');
          });
        });

        describe('when now is equal to a second after the end datetime', async function () {
          beforeEach(async function () {
            await increaseTime(moment.duration(10, 'day').asSeconds() + 1)
          });

          it('closes the raffle', async function () {
            transaction = await etherRaffle.close({ from: sender, gasPrice: 0 });
            const pot = await etherRaffle.pot();
            const opened = await etherRaffle.opened();
            const winner = await etherRaffle.winner();

            opened.should.be.false;
            pot.should.be.bignumber.equal(new BigNumber(0));
            winner.should.be.equal('0x0000000000000000000000000000000000000000');
            web3.eth.getBalance(etherRaffle.address).should.bignumber.be.equal(new BigNumber(0));
            transaction.logs[0].event.should.be.equal('Close');
          });
        });

        describe('when now is equal to a second before the end datetime', async function () {
          beforeEach(async function () {
            await increaseTime(moment.duration(10, 'day').asSeconds() - 1)
          });

          it('does not close the raffle', async function () {
            try {
              transaction = await etherRaffle.close({ from: sender, gasPrice: 0 });
            } catch (error) {
              error.message.search('invalid opcode').should.be.above(0);
            }
            const pot = await etherRaffle.pot();
            const opened = await etherRaffle.opened();
            const winner = await etherRaffle.winner();

            opened.should.be.true;
            pot.should.be.bignumber.equal(new BigNumber(0));
            winner.should.be.equal('0x0000000000000000000000000000000000000000');
            web3.eth.getBalance(etherRaffle.address).should.bignumber.be.equal(new BigNumber(0));
          });
        });
      });
    });
  });
});
