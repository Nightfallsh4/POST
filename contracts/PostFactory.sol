// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "./Interfaces/ISoulboundFactory.sol";
import "./Interfaces/IERC4973RepFactory.sol";
import "./Interfaces/IERC4973AttestFactory.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PostFactory is Ownable {


	string public creator;
	uint256 public mintFee;
	address public soulboundFactoryAddress;
	address public erc4973RepFactoryAddress;
	address public erc4973AttestFactoryAddress;

	// Events
	event DropCreated(
		string dropType,
		address dropAddress
	);

	constructor(string memory _creator, uint256 _mintFee) {
		creator = _creator;
		mintFee = _mintFee;
	}

	function createSoulboundToken(
		string memory _name,
		string memory _symbol,
		string memory version,
		string memory _uri,
		bytes32 _root,
		uint256 _mintLimit,
		uint256 initialTokenId
	) external payable returns (address) {
		require(msg.value >= mintFee, "Value sent less than mintFee");
		ISoulboundFactory soulboundFactory = ISoulboundFactory(
			soulboundFactoryAddress
		);
		address dropAddress = soulboundFactory.createDrop(
			_name,
			_symbol,
			version,
			_uri,
			_root,
			_mintLimit,
			initialTokenId
		);
		emit DropCreated("Soulbound",dropAddress);
		return dropAddress;
	}

	function createSoulboundReputationToken(
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
		require(msg.value >= mintFee, "Value sent less than mintFee");
		IERC4973RepFactory erc4973RepFactory = IERC4973RepFactory(
			erc4973RepFactoryAddress
		);
		address dropAddress = erc4973RepFactory.createDrop(
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
		emit DropCreated("ERC4973Rep",dropAddress);
		return dropAddress;
	}

	function createSoulboundAttestationToken(
		string memory _name,
		string memory _symbol,
		string memory version,
		string memory _uri,
		bytes32 _root,
		uint256 _mintLimit,
		uint256 initialTokenId
	) external payable returns (address) {
		require(msg.value >= mintFee, "Value sent less than mintFee");
		IERC4973AttestFactory erc4973AttestFactory = IERC4973AttestFactory(
			erc4973AttestFactoryAddress
		);

		address dropAddress = erc4973AttestFactory.createDeploy(
			_name,
			_symbol,
			version,
			_uri,
			_root,
			_mintLimit,
			initialTokenId
		);
		emit DropCreated("ERC4973Attest", dropAddress);
		return dropAddress;
	}

	function setMintFee(uint _mintFee) external onlyOwner() {
		mintFee = _mintFee;
	}

    function setAddresses(address[3] memory addressList) external onlyOwner() {
        soulboundFactoryAddress = addressList[0];
        erc4973RepFactoryAddress = addressList[1];
        erc4973AttestFactoryAddress = addressList[2];
    }

	function withdrawFees() external onlyOwner() {
		(bool sent, ) = payable(owner()).call{ value: address(this).balance }("");
		require(sent, "Error occured while transfer");
	}
}
