const { expect, assert } = require("chai")
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

/* global BigInt */

!developmentChains.includes(network.name)
	? describe.skip
	: describe("Souldbound token Unit test", function () {
			let soulbound, deployer, player
			beforeEach(async () => {
				deployer = (await getNamedAccounts()).deployer
				player = (await getNamedAccounts()).player
				await deployments.fixture(["all"])
				soulbound = await ethers.getContract("Soulbound", deployer)
			})

			describe("Check constructor fucntion", function () {
				it("Checks if params set correctly", async () => {
					const name = await soulbound.name()
					const symbol = await soulbound.symbol()
					assert.equal("Soulbound", name)
					assert.equal("SB", symbol)
				})
			})

			describe("Check mint function", function () {
				it("Check if minted to correct address", async () => {
					const tokenId = await soulbound.tokenId()
					await soulbound.mint()
					const address = await soulbound.ownerOf(tokenId)
					assert.equal(deployer, address)
				})

				it("check if tokenId has increased", async () => {
					const tokenId = await soulbound.tokenId()
					await soulbound.mint()
					const secondTokenId = await soulbound.tokenId()
					assert.equal(tokenId.toNumber() + 1, secondTokenId.toNumber())
				})

				it("Checks if balanceOf is updated", async () => {
					const initialBalance = await soulbound.balanceOf(deployer)
					await soulbound.mint()
					const secondBalance = await soulbound.balanceOf(deployer)
					assert.equal(initialBalance.toNumber() + 1, secondBalance.toNumber())
				})

				it("Checks if tokenURI is set", async () => {
					const tokenId = await soulbound.tokenId()
					await soulbound.mint()
					const tokenURI = await soulbound.tokenURI(tokenId)
					assert.equal("nightfallsh4.medium.com", tokenURI)
				})
			})

			describe("Testing ERC4973 features", () => {
				it("Checks if unequips", async () => {
					const tokenId = await soulbound.tokenId()
					await soulbound.mint()
					const initialOwner = await soulbound.ownerOf(tokenId)
					await soulbound.unequip(tokenId)
					await expect(soulbound.ownerOf(tokenId)).to.be.revertedWith(
						"ownerOf: token doesn't exist",
					)
				})

				// it("Checks if give works", async () => {
				// 	const tokenId = await soulbound.tokenId()
				// 	await soulbound.mint()
				// 	const tokenURI = await soulbound.tokenURI(tokenId)
				// 	const owner = await soulbound.ownerOf(tokenId)
				// 	const contractHash = await soulbound._getHash(
				// 		deployer,
				// 		player,
				// 		tokenURI,
				// 	)

				// 	console.log(owner)
				// 	console.log(player)
				// 	const types = {
				// 		Agreement: [
				// 			{ name: "active", type: "address" },
				// 			{ name: "passive", type: "address" },
				// 			{ name: "tokenURI", type: "string" },
				// 		],
				// 	}
				// 	const domain = {
				// 		name: "Soulbound",
				// 		version: "1",
				// 		chainId: 31337,
				// 		verifyingContract: soulbound.address,
				// 	}
				// 	// console.log(tokenURI)
				// 	const agreement = {
				// 		active: deployer,
				// 		passive: player,
				// 		tokenURI: tokenURI,
				// 	}
				// 	const signer = await ethers.getSigner(player)

				// 	// const signature = await signer._signTypedData(
				// 	// 	domain,
				// 	// 	types,
				// 	// 	agreement,
				// 	// )
				// 	const signature = await signer.signMessage(player)

				// 	console.log("Contract Hash:- " + contractHash)
				// 	console.log("Signature:- "+signature)
				// 	const { compact } = ethers.utils.splitSignature(signature)
				// 	console.log(compact)
				// 	const secondTokenId = await soulbound.give(
				// 		player,
				// 		tokenURI,
				// 		compact,
				// 	)
				// 	console.log("secondTokenId:- " + secondTokenId)
				// 	const secondOwner = await soulbound.ownerOf(secondTokenId)
				// 	console.log(secondOwner)
				// 	assert.equal(player, secondOwner)
				// })
			})
	  })
