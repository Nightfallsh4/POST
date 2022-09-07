// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import "./ERC4973Attest.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC4973AttestFactory is Ownable {
	address public proxy;

	constructor(address _proxy) {
		proxy = _proxy;
	}

    function createdeploy(
		string memory _name,
		string memory _symbol,
		string memory version,
		string memory _uri,
		bytes32 _root,
		uint256 _mintLimit,
		uint256 initialTokenId
	) external payable returns (address) {
        require(msg.sender == proxy,"Only Proxy Contract can call this");
		ERC4973Attest attestationToken = new ERC4973Attest(
			_name,
			_symbol,
			version,
			_uri,
			_root,
			_mintLimit,
			initialTokenId
		);
		return address(attestationToken);
	}

    function withdrawFees() external onlyOwner(){
        (bool sent,) = payable(owner()).call{value: address(this).balance}("");
        require(sent,"Error occured while transfer");
    }
}