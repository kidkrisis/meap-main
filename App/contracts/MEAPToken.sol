// contracts/meapToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MEAPToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("MyEthereumAudioPlayer", "MEAP") {
        _mint(msg.sender, initialSupply);
    }
}