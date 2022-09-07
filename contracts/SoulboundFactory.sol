// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import "./Soulbound.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract SoulboundFactory is Ownable{
    address public proxy;

    constructor(address _proxy) {
        proxy = _proxy;
    }

    function createDrop(
		string memory _name,
		string memory _symbol,
		string memory version,
		string memory _uri,
		bytes32 _root,
		uint256 _mintLimit,
		uint256 initialTokenId
	) external payable returns (address) {
        require(msg.sender == proxy,"Only Proxy Contract can call this");
		Soulbound soulbound = new Soulbound(
			_name,
			_symbol,
			version,
			_uri,
			_root,
			_mintLimit,
			initialTokenId
		);
		return address(soulbound);
	}

    function withdrawFees() external onlyOwner(){
        (bool sent,) = payable(owner()).call{value: address(this).balance}("");
        require(sent,"Error occured while transfer");
    }
    
}