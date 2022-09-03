const { expect, assert } = require("chai")
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace")
const { developmentChains } = require("../../helper-hardhat-config")
/* global BigInt */

!developmentChains.includes(network.name)
	? describe.skip
	: describe("Souldbound token Unit test", function () {
        let soulbound, deployer
        beforeEach(async () => {
            deployer = (await getNamedAccounts()).deployer
            await deployments.fixture(["all"])
            soulbound = await ethers.getContract("Soulbound",deployer)
        })

        describe("Check constructor fucntion", function () {
            it("Checks if params set correctly", async () => {
                const name = await soulbound.name()
                const symbol = await soulbound.symbol()
                assert.equal("Hello", name)
                assert.equal("world", symbol)
            })
        })

        describe("Check mint function", function () {
            it("Check if minted to correct address", async () => {
                const tokenId = await soulbound.tokenId()
                await soulbound.mint()
                const address = await soulbound.ownerOf(tokenId)
                assert.equal(deployer,address)
            })

            it("check if tokenId has increased", async () => {
                const tokenId = await soulbound.tokenId()
                await soulbound.mint()
                const secondTokenId = await soulbound.tokenId()
                assert.equal(tokenId.toNumber()+1,secondTokenId.toNumber())
            }) 

            it("Checks if balanceOf is updated", async () => {
                const initialBalance = await soulbound.balanceOf(deployer)
                await soulbound.mint()
                const secondBalance = await soulbound.balanceOf(deployer)
                assert.equal(initialBalance.toNumber()+1, secondBalance.toNumber())
            })
        })
    })