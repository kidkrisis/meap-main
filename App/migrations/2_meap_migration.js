var meap = artifacts.require("../contracts/meap.sol");

module.exports = function(deployer) {
  deployer.deploy(meap);
};