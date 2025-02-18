// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "./INFTCollection.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC721Holder} from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract Destripe is Ownable, ERC721Holder {
    INFTCollection public nftColection;
    IERC20 public acceptToken;

    uint public monthlyAmount = 0.001 ether;
    uint private constant thirtyDaysInSeconds = 30 * 24 * 60 * 60;

    struct Customer {
        uint tokenId;
        uint nextPayment;
        uint index;
    }

    mapping(address => Customer) public payments; //cutomer address =>  payment info
    address[] public customers; // customers addresses

    event Paid(address indexed customer, uint date, uint amount);
    event Granted(address indexed customer, uint tokenId, uint date);
    event Revoked(address indexed customer, uint tokenId, uint date);
    event Removed(address indexed customer, uint tokenId, uint date);

    constructor(address tokenAddress, address nftAddress) Ownable(msg.sender) {
        nftColection = INFTCollection(nftAddress);
        acceptToken = IERC20(tokenAddress);
    }

    function setMonthlyAmount(uint newMonthlyAmount) external onlyOwner {
        monthlyAmount = newMonthlyAmount;
    }

    function removeCustomer(address customer) external onlyOwner {
        uint tokenId = payments[customer].tokenId;
        nftColection.burn(tokenId);

        delete customers[payments[customer].index];
        delete payments[customer];

        emit Removed(customer, tokenId, block.timestamp);
    }

     function pay(address customer) external onlyOwner {
        bool thrityDayesHavePassed = payments[customer].nextPayment <= block.timestamp;
        bool firstPayment = payments[customer].nextPayment == 0;
        bool hasAmount = acceptToken.balanceOf(customer) >= monthlyAmount;
        bool hasAllowance = acceptToken.allowance(customer, address(this)) >= monthlyAmount;

     
        if (!hasAmount || !hasAllowance) {
            emit Revoked(customer, payments[customer].tokenId, block.timestamp);
            return;
        }

   
        if (firstPayment) {
           
            acceptToken.transferFrom(customer, address(this), monthlyAmount);
            
            nftColection.mint(customer);
            payments[customer].tokenId = nftColection.getLastTokenId();
            payments[customer].index = customers.length;
            customers.push(customer);
            
           
            payments[customer].nextPayment = block.timestamp + thirtyDaysInSeconds;
            
            emit Granted(customer, payments[customer].tokenId, block.timestamp);
            emit Paid(customer, block.timestamp, monthlyAmount);
            return;
        }

        if (thrityDayesHavePassed) {
            uint tokenId = payments[customer].tokenId;
            
 
            if (nftColection.ownerOf(tokenId) != customer) {
                nftColection.safeTransferFrom(
                    address(this),
                    customer,
                    tokenId
                );
                emit Granted(customer, tokenId, block.timestamp);
            }

            acceptToken.transferFrom(customer, address(this), monthlyAmount);
            payments[customer].nextPayment = block.timestamp + thirtyDaysInSeconds;
            
            emit Paid(customer, block.timestamp, monthlyAmount);
        }

    }
}
