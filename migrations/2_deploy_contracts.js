const GamblethFactory = artifacts.require("./GamblethFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(GamblethFactory);
};
