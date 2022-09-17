// deploy/00_deploy_your_contract.js

//const { ethers } = require("hardhat");
const { MerkleTree } = require("merkletreejs")
const keccak256 = require("keccak256")

module.exports = async ({ getNamedAccounts, deployments }) => {
	const { deploy } = deployments
	const { deployer, player } = await getNamedAccounts()
	const leaves = [deployer, player].map((x) => keccak256(x))
	const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
	const root = tree.getHexRoot()
	const leaf = keccak256(player)

	const soulbound = await deploy("Soulbound", {
		from: deployer,
		args: [
			"Soulbound",
			"SB",
			"1",
			"bafybeid4yz4ytfi46ku76nvpzmifkcrysa5w7err6yb6uftflga5g7z33u",
			root,
			3,
			0,
		],
		log: true,
	})
	console.log(soulbound.receipt);
}
module.exports.tags = ["Soulbound", "all"]
