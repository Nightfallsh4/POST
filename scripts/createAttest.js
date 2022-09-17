const {ethers, getNamedAccounts, deployments} = require("hardhat")
const { parseEther } = require("ethers/lib/utils")
const addressAbi = require("../deployments/goerli/PostFactory.json")
require("dotenv")

async function main() {
	const { deploy } = deployments
	const { deployer, player } = await getNamedAccounts()


	const contractAddress = "0x3e646aCfDaa901239A72f86a79bf1aE93B2596ee"

	const postFactory = await ethers.getContractAt("PostFactory", contractAddress)


	const tx = await postFactory.createSoulboundReputationToken(
		"Test1",
		"T1",
        "1",
		"nightfallsh4.medium.com",
		"0x070e8db97b197cc0e4a1790c5e6c3667bab32d733db7f815fbe84f5824c7168d",
		3,
		0,
		{ value: parseEther("0.1") },
	)

    const txReceipt = await tx.wait(1)
    console.log(txReceipt.events[0].args.dropAddress)
}

main()