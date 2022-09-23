import "../styles/globals.css"
import "@rainbow-me/rainbowkit/styles.css"
import {
	getDefaultWallets,
	RainbowKitProvider,
	lightTheme,
	Theme,
	darkTheme,
} from "@rainbow-me/rainbowkit"
import { chain, configureChains, createClient, WagmiConfig } from "wagmi"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"
import { ChakraProvider } from "@chakra-ui/react"
import merge from "lodash.merge"
import Head from 'next/head'


const { chains, provider } = configureChains(
	[
		chain.localhost,
		chain.goerli, 
		// chain.sepolia, chain.polygonMumbai, chain.optimismGoerli
	],
	[alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()],
)
const { connectors } = getDefaultWallets({
	appName: "My RainbowKit App",
	chains,
})
const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider,
})

function MyApp({ Component, pageProps }) {
	return (
		<div className="bg-[#f7efe8] font-['ALEGREYA SANS']">
			<Head>
				<title>POST</title>
				<link rel="icon" type="image/x-icon" href="Logo.png"/>
			</Head>
			<WagmiConfig client={wagmiClient}>
				<ChakraProvider>
					<RainbowKitProvider
						chains={chains}
						theme={lightTheme({accentColor:"#7d769b",accentColorForeground: '#f7efe8', overlayBlur:"large"})}
					>
						<Component {...pageProps} />
					</RainbowKitProvider>
				</ChakraProvider>
			</WagmiConfig>
		</div>
	)
}

export default MyApp
