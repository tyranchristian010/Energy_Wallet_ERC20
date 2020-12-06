const Dai = artifacts.require("Dai");

module.exports = async function(deployer, _network, accounts) {
  await deployer.deploy(Dai);
  const dai = await Dai.deployed();                 //deployed contract instance of Dai token.
    await dai.faucet(accounts[0], web3.utils.toWei('1000'));   //mint 1000 dai tokens 
                                                   //copy and paste the account from ganache for 1000 dai
    };