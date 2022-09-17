const {ethers, getNamedAccounts, deployments} = require("hardhat")
const { parseEther } = require("ethers/lib/utils")
const addressAbi = require("../deployments/goerli/PostFactory.json")
require("dotenv")

async function main() {
	const { deploy } = deployments
	const { deployer, player } = await getNamedAccounts()


	const contractAddress = "0x3e646aCfDaa901239A72f86a79bf1aE93B2596ee"

	const postFactory = await ethers.getContractAt("PostFactory", contractAddress)


	const tx = await postFactory.createSoulboundToken(
		"Test1",
		"T1",
        "1",
		"nightfallsh4.medium.com",
		"0xe5138641064c9686935546c3267e44a6a0a8d58c623e1ff8e291b704b7f39d58",
		3,
		0,
		{ value: parseEther("0.1") },
	)

    const txReceipt = await tx.wait(1)
    console.log(txReceipt.events[0].args.dropAddress)
}

main()