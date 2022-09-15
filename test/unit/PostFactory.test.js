const { expect, assert } = require("chai")
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { MerkleTree } = require("merkletreejs")
const keccak256 = require("keccak256")

/* global BigInt */

!developmentChains.includes(network.name)
	? describe.skip
	: describe("ERC4973Attest token Unit test", function () {
			let postFactory,
				deployer,
				player,
				playerPostFactory,
				player2,
				leaves,
				tree,
				name,
				symbol,
				version,
				uri,
				root,
				mintLimit,
				initialTokenId
			beforeEach(async () => {
				deployer = (await getNamedAccounts()).deployer
				player = (await getNamedAccounts()).player
				player2 = (await getNamedAccounts()).player2
				await deployments.fixture(["Factories"])
				postFactory = await ethers.getContract("PostFactory", deployer)
				playerPostFactory = await ethers.getContract("PostFactory", player)
				// player2PostFactory = await ethers.getContract("PostFactory", player2)
				leaves = [deployer, player].map((x) => keccak256(x))
				tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
				name = "Test1"
				symbol = "T1"
				version = "1"
				uri = "bafybeid4yz4ytfi46ku76nvpzmifkcrysa5w7err6yb6uftflga5g7z33u"
				root = tree.getHexRoot()
				mintLimit = 2
				initialTokenId = 0
			})

			describe("Constructor Function Tests", () => {
				it("Checks if constructor arguments set correctly", async () => {
					const creator = await postFactory.creator()
					const mintFee = await postFactory.mintFee()
					const expectedMintFee = ethers.utils.parseEther("0.001")
					assert.equal(creator, "nightfallsh4")
					assert.equal(mintFee.toString(), expectedMintFee.toString())
				})
			})

			describe("createSoulboundToken Function tests", () => {
				it("Reverts if value is less than mintFee", async () => {
					await expect(
						postFactory.createSoulboundToken(
							name,
							symbol,
							version,
							uri,
							root,
							mintLimit,
							initialTokenId,
						),
					).to.be.revertedWith("Value sent less than mintFee")
				})

				it("Returns drop address", async () => {
					const mintFee = ethers.utils.parseEther("0.001")
					const dropAddress = await postFactory.createSoulboundToken(
						name,
						symbol,
						version,
						uri,
						root,
						mintLimit,
						initialTokenId,
						{ value: mintFee },
					)
					assert.exists(dropAddress)
				})

				it("Emits DropCreated", async () => {
					const mintFee = ethers.utils.parseEther("0.001")
					expect(
						await postFactory.createSoulboundToken(
							name,
							symbol,
							version,
							uri,
							root,
							mintLimit,
							initialTokenId,
							{ value: mintFee },
						),
					).to.emit("DropCreated")
				})
			})
			describe("createSoulboundReputationToken Function tests", () => {
				it("Reverts if value is less than mintFee", async () => {
					const addIncrement = 5
					const reduceIncrement = 25
					await expect(
						postFactory.createSoulboundReputationToken(
							name,
							symbol,
							version,
							uri,
							root,
							mintLimit,
							initialTokenId,
							addIncrement,
							reduceIncrement,
						),
					).to.be.revertedWith("Value sent less than mintFee")
				})

				it("Returns drop address", async () => {
					const mintFee = ethers.utils.parseEther("0.001")
					const addIncrement = 5
					const reduceIncrement = 25
					const dropAddress = await postFactory.createSoulboundReputationToken(
						name,
						symbol,
						version,
						uri,
						root,
						mintLimit,
						initialTokenId,
						addIncrement,
						reduceIncrement,
						{ value: mintFee },
					)
					assert.exists(dropAddress)
				})

				it("Emits DropCreated", async () => {
					const mintFee = ethers.utils.parseEther("0.001")
					const addIncrement = 5
					const reduceIncrement = 25
					expect(
						await postFactory.createSoulboundReputationToken(
							name,
							symbol,
							version,
							uri,
							root,
							mintLimit,
							initialTokenId,
							addIncrement,
							reduceIncrement,
							{ value: mintFee },
						),
					).to.emit("DropCreated")
				})
			})
			describe("createSoulboundAttestationToken Function tests", () => {
				it("Reverts if value is less than mintFee", async () => {
					await expect(
						postFactory.createSoulboundAttestationToken(
							name,
							symbol,
							version,
							uri,
							root,
							mintLimit,
							initialTokenId,
						),
					).to.be.revertedWith("Value sent less than mintFee")
				})

				it("Returns drop address", async () => {
					const mintFee = ethers.utils.parseEther("0.001")
					const dropAddress = await postFactory.createSoulboundAttestationToken(
						name,
						symbol,
						version,
						uri,
						root,
						mintLimit,
						initialTokenId,
						{ value: mintFee },
					)
					assert.exists(dropAddress)
				})

				it("Emits DropCreated", async () => {
					const mintFee = ethers.utils.parseEther("0.001")
					expect(
						await postFactory.createSoulboundAttestationToken(
							name,
							symbol,
							version,
							uri,
							root,
							mintLimit,
							initialTokenId,
							{ value: mintFee },
						),
					).to.emit("DropCreated")
				})
			})

			describe("setMintFee Function tests", () => {
				it("Checks if mintFee is set properly", async () => {
					const newMintFee = ethers.utils.parseEther("0.002")
					await postFactory.setMintFee(newMintFee)
					const updatedMintFee = await postFactory.mintFee()
					assert.equal(updatedMintFee.toString(), newMintFee.toString())
				})
			})

			describe("withdrawFees function tests", () => {
				it("check if funds withdrawn correctly", async () => {
					const mintFee = ethers.utils.parseEther("0.001")
					const deployerBalance = await ethers.provider.getBalance(deployer)
					const deployAddress = await playerPostFactory.createSoulboundToken(
						name,
						symbol,
						version,
						uri,
						root,
						mintLimit,
						initialTokenId,
						{ value: mintFee },
					)
					const deployAddress2 = await playerPostFactory.createSoulboundToken(
						name,
						symbol,
						version,
						uri,
						root,
						mintLimit,
						initialTokenId,
						{ value: mintFee },
					)
					const contractMintFee = await ethers.provider.getBalance(postFactory.address)
					const txResponse = await postFactory.withdrawFees()
					const txReceipt = await txResponse.wait(1)
					const updatedDeployerBalance = await ethers.provider.getBalance(deployer)
					const totalGas = BigInt(txResponse.gasPrice) * BigInt(txReceipt.gasUsed)
					const expectedBalance = BigInt(deployerBalance) - totalGas + BigInt(contractMintFee)
					expect(expectedBalance, updatedDeployerBalance)
				})
			})
	  })
