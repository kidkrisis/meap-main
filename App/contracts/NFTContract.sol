// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTContract is ERC721 {
    constructor() ERC721("MyNFT", "MEAP") {}

    function mint(address to, uint256 tokenId) public {
        _safeMint(to, tokenId);
    }
}