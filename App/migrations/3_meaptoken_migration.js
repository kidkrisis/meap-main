var meaptoken = artifacts.require("../contracts/MEAPtoken.sol");

module.exports = function(deployer) {
  deployer.deploy(meaptoken, 9000000000000000);
};