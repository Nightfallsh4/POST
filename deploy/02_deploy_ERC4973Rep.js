// deploy/00_deploy_your_contract.js

//const { ethers } = require("hardhat");
const { MerkleTree } = require("merkletreejs")
const keccak256 = require("keccak256")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments
	const { deployer, player } = await getNamedAccounts()
	const leaves = [deployer, player].map(x => keccak256(x))
	const tree = new MerkleTree(leaves, keccak256, {sortPairs:true})
  const root = tree.getHexRoot()
  const leaf = keccak256(player)


	await deploy("ERC4973Rep", {
		// Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
		from: deployer,
		args: [
			"ERC4973Rep",
			"REP",
			"1",
			"bafybeihb7c3dci47emksiwjviixkiq2xkfcasn4refpupsy5uhzy32b5oq",
			root,
			3,
			0,
			5,
			25,
		],
		log: true,
	})
}
module.exports.tags = ["ERC4973Rep", "all"]
