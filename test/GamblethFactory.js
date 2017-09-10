const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const EtherRaffle = artifacts.require('EtherRaffle');
const GamblethFactory = artifacts.require('GamblethFactory');

contract('GamblethFactory', accounts => {
  describe('given an gableth factory contract', async function () {
    let factory = null;
    const owner = accounts[0];

    beforeEach(async function() {
      factory = await GamblethFactory.new({ from: owner });
    });

    describe('when the owner creates a ruffle', async function() {
      let transaction = null;

      describe('when the given price is greater than 0', async function() {
        const price = new BigNumber(10);

        describe('when the given number of days is greater than 0', async function() {
          const days = new BigNumber(5);

          it('creates a raffle and transfer the ownership to the owner', async function () {
            transaction = await factory.createRaffle("my raffle", days, price, { from: owner, gasPrice: 0 });

            transaction.logs[0].event.should.be.equal('RaffleCreated');
            const raffleAddress = transaction.logs[0].args.raffleAddress;
            const raffle = await EtherRaffle.at(raffleAddress);
            const pot = await raffle.price();
            const name = await raffle.name();
            const raffleOwner = await raffle.owner();
            const numberOfDays = await raffle.numberOfDays();

            name.should.be.equal("my raffle");
            raffleOwner.should.be.equal(owner);
            pot.should.be.bignumber.equal(price);
            numberOfDays.should.be.bignumber.equal(days);
          });
        });

        describe('when the given number of days is less than 1', async function() {
          const days = new BigNumber(0);

          it('does not create a raffle contract', async function () {
            try {
              transaction = await factory.createRaffle("my raffle", days, price, { from: owner, gasPrice: 0 });
            } catch (error) {
              error.message.search('invalid opcode').should.be.above(0);
            }
          });
        });
      });

      describe('when the given price is less than 1', async function() {
        const price = new BigNumber(0);

        describe('when the given number of days is greater than 0', async function() {
          const days = new BigNumber(5);

          it('does not create a raffle contract', async function () {
            try {
              transaction = await factory.createRaffle("my raffle", days, price, { from: owner, gasPrice: 0 });
            } catch (error) {
              error.message.search('invalid opcode').should.be.above(0);
            }
          });
        });

        describe('when the given number of days is less than 1', async function() {
          const days = new BigNumber(0);

          it('does not create a raffle contract', async function () {
            try {
              transaction = await factory.createRaffle("my raffle", days, price, { from: owner, gasPrice: 0 });
            } catch (error) {
              error.message.search('invalid opcode').should.be.above(0);
            }
          });
        });
      });
    });
  });
});
