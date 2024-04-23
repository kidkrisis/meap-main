var nftcontract = artifacts.require("../contracts/NFTContract.sol");

module.exports = function(deployer) {
  deployer.deploy(nftcontract);
};