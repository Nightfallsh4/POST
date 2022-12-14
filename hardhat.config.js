require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL
const ACCOUNT_PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY
const UNSAFE_MAINNET_RPC_URL = process.env.UNSAFE_MAINNET_RPC_URL
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

module.exports = {
	solidity: "0.8.16",
	// solidity: {
		// compilers: [{ version: "0.8.9" }, { version: "0.4.19" }, { version: "0.6.12" }],
	// },
	gasReporter: {
		enabled: false,
	},
	etherscan:{
		apiKey: ETHERSCAN_API_KEY
	},
	defaultNetwork: "hardhat",
	networks: {
		hardhat: {
			chainId: 31337,
			// forking: {
			// 	url: UNSAFE_MAINNET_RPC_URL
			// },
			blockConfirmations: 1,
		},
		rinkeby: {
			chainId: 4,
			blockConfirmations: 2,
			url: RINKEBY_RPC_URL,
			accounts: [ACCOUNT_PRIVATE_KEY],
		},
		goerli:{
			chainId: 5,
			blockConfirmations:3,
			url: GOERLI_RPC_URL,
			accounts: [ACCOUNT_PRIVATE_KEY]
		},
		localhost: {
			chainId:31337,
			blockConfirmations:1,
		}
	},
	namedAccounts: {
		deployer: {
			default: 0,
		},
		player: {
			default: 1,
		},
		player2: {
			default: 2,
		},
		player3: {
			default: 3,
		},
	},
}
