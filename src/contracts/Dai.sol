pragma solidity ^0.6.0;
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract Dai is ERC20 {
    constructor() ERC20('Dai Stablecoin', 'DAI')public{}

    function faucet(address to, uint amount) external {
        _mint(to, amount);
    }
}
//we inherit all the ERC20 standard functionality into our contract.
//we call the constructor of the ERC20 in our constructor.
//we create a magic token maker called a faucet and run the ERC20 function _mint()
//next write your 2_deploy_contract.js migration 