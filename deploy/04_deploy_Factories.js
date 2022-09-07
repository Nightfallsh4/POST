const { ethers } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
	const { deploy } = deployments
	const { deployer, player } = await getNamedAccounts()

	const mintFee = ethers.utils.parseEther("0")
	const {address} = await deploy("PostFactory", {
		from: deployer,
		args: ["Shanmugadevan NVD", mintFee],
		log: true,
	})
	console.log(address)
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
	console.log("Setting Address in PostFactory.......")
	await postFactory.setAddresses([soulboundFactoryaddress, erc4973RepFactoryaddress, erc4973AttestFactoryaddress])
	console.log("Addresses set!");
}
module.exports.tags = ["Factories", "all"]
