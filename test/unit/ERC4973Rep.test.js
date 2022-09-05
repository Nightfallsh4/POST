const { expect, assert } = require("chai")
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

/* global BigInt */

!developmentChains.includes(network.name)
	? describe.skip
	: describe("ERC4973Rep token Unit test", function () {
			let erc4973Rep, deployer, player
			beforeEach(async () => {
				deployer = (await getNamedAccounts()).deployer
				player = (await getNamedAccounts()).player
				await deployments.fixture(["all"])
				erc4973Rep = await ethers.getContract("ERC4973Rep", deployer)
			})

            describe("Constructor Function", () => {
                it("Check if issuer is set", async () => {
                    const issuer = await erc4973Rep.issuer()
                    assert.equal(issuer,deployer)
                })

                it("Checks if addIncrement is set", async () => {
                    const addIncrement = await erc4973Rep.addIncrement()
                    assert.equal(addIncrement, 5)
                })

                it("Checks if reduceIncrement os set", async () => {
                    const reduceIncrement = await erc4973Rep.reduceIncrement()
                    assert.equal(reduceIncrement,25)
                })

                it()
            })
	  })
