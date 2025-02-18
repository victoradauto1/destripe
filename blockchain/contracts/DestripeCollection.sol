// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Burnable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./INFTCollection.sol";

contract DestripeCollection is ERC721, ERC721Burnable, Ownable, INFTCollection {
    uint256 private nextTokenId;
    address public authorizedContract;
    string public baseUri = "https://localhost3000/nfts/";

    constructor(
        address initialOwner
    ) ERC721("Destripe", "DSP") Ownable(initialOwner) {}

    function setAuthorized(address newAuthorizedContract) external onlyOwner {
        authorizedContract = newAuthorizedContract;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseUri;
    }

    function setBaseUri(string calldata newBaseUri) external onlyOwner {
        baseUri = newBaseUri;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return string.concat(_baseURI(), Strings.toString(tokenId), ".json");
    }

    function burn(uint256 tokenId) public override(ERC721Burnable, INFTCollection) {
        require(
            msg.sender == authorizedContract || msg.sender == owner(),
            "Only the owner or authorized Contract can burn"
        );
        super.burn(tokenId);
    }

    function getLastTokenId() external view returns (uint256) {
        return nextTokenId - 1;
    }

    function setApprovalForAll(
        address operator,
        bool approved
    ) public override(ERC721, IERC721) onlyOwner {
        super.setApprovalForAll(operator, approved);
    }

    function mint(address customer) external returns (uint256) {
        require(
            msg.sender == authorizedContract || msg.sender == owner(),
            "Only the owner or authorized Contract can mint"
        );
        uint256 tokenId = nextTokenId++;
        _safeMint(customer, tokenId);
        _setApprovalForAll(customer, authorizedContract, true);
        return tokenId;
    }
}