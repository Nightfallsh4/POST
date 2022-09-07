// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import "./ERC4973Rep.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC4973RepFactory is Ownable {
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
		uint256 initialTokenId,
		uint256 _addIncrement,
		uint256 _reduceIncrement
	) external payable returns (address) {
        require(msg.sender == proxy,"Only Proxy Contract can call this");
        ERC4973Rep reputationToken = new ERC4973Rep(
			_name,
			_symbol,
			version,
			_uri,
			_root,
			_mintLimit,
			initialTokenId,
			_addIncrement,
			_reduceIncrement
		);
		return address(reputationToken);
	}

    function withdrawFees() external onlyOwner(){
        (bool sent,) = payable(owner()).call{value: address(this).balance}("");
        require(sent,"Error occured while transfer");
    }
}
