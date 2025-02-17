// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "./INFTCollection.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Destripe is Ownable {

    INFTCollection public nftColection;
    IERC20 public acceptToken;


    constructor(address tokenAddress, address nftAddress) Ownable(msg.sender){
        nftColection = INFTCollection(nftAddress);
        acceptToken = IERC20(tokenAddress);
    }
}
