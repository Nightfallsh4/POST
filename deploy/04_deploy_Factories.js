const { ethers, network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const {verify} =require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
	const { deploy } = deployments
	const { deployer, player } = await getNamedAccounts()

	const mintFee = ethers.utils.parseEther("0.001")
	const arguments = ["nightfallsh4", mintFee]
	const {address, receipt} = await deploy("PostFactory", {
		from: deployer,
		args: arguments,
		log: true,
	})

	if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
		
		await verify(address,arguments)
	}
	const postFactory = await ethers.getContractAt("PostFactory",address)
	const {address:soulboundFactoryaddress} = await deploy("SoulboundFactory", {
		from: deployer,
		args: [address],
		log: true,
	})
	const {address:erc4973RepFactoryaddress} = await deploy("ERC4973RepFactory", {
		from: deployer,
		args: [address],
		log: true,
	})
	const {address:erc4973AttestFactoryaddress} = await deploy("ERC4973AttestFactory", {
		from: deployer,
		args: [address],
		log: true,
	})
	await postFactory.setAddresses([soulboundFactoryaddress, erc4973RepFactoryaddress, erc4973AttestFactoryaddress])
	console.log("Post Factory Address:- " + address)
	// console.log(receipt)
}
module.exports.tags = ["Factories", "all"]
