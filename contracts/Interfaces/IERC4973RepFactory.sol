// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import "@openzeppelin/contracts/access/Ownable.sol";

contract IERC4973RepFactory is Ownable {
	address public proxy;

	constructor(address _proxy) {}

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
	) external payable returns (address) {}

	function withdrawFees() external onlyOwner() {}
}
