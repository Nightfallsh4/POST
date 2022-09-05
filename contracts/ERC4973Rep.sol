// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "erc4973/src/ERC4973.sol";

contract ERC4973Rep is ERC4973 {

    string public uri;
	uint public tokenId = 1;
	address public issuer;
    uint public reputation;
	uint public addIncrement;
	uint public reduceIncrement;


	modifier isIssuer() {
		require(msg.sender==issuer,"Only issuer can change reputation");
		_;
	}

    constructor(
		string memory _name,
		string memory _symbol,
		string memory version,
		string memory _uri,
		uint _addIncrement,
		uint _reduceIncrement
	) ERC4973(_name, _symbol, version){
		issuer= msg.sender;
		uri = _uri;
		addIncrement = _addIncrement;
		reduceIncrement = _reduceIncrement;
	}

    function mint() external {
		_mint(address(0),msg.sender,tokenId,uri);
		tokenId+= 1;
	}

    function increaseReputation() external isIssuer() {
        reputation += addIncrement;
    }

	function decreaseReputation() external isIssuer() {
		reputation -= reduceIncrement;
	}
    
}