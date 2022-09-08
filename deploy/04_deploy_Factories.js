const { ethers } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
	const { deploy } = deployments
	const { deployer, player } = await getNamedAccounts()

	const mintFee = ethers.utils.parseEther("0.001")
	const {address} = await deploy("PostFactory", {
		from: deployer,
		args: ["nightfallsh4", mintFee],
		log: true,
	})
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
}
module.exports.tags = ["Factories", "all"]
