// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface INFTCollection is IERC721 {

    function setAuthorized(address newAuthorizedContract) external;

    function setBaseUri(string calldata newBaseUri) external;

    function getLastTokenId() external view returns (uint256);

    function mint(address customer) external returns (uint256);

    function burn(uint256 tokenId) external;
}
