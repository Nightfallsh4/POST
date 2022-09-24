import dynamic from "next/dynamic"
import "../styles/globals.css"
import "@rainbow-me/rainbowkit/styles.css"
import {
	getDefaultWallets,
	lightTheme,
	RainbowKitProvider
} from "@rainbow-me/rainbowkit"
// const RainbowKitProvider =dynamic(async () => {return (await import("@rainbow-me/rainbowkit")).default})
// const {RainbowKitProvider} = RainbowKit
import { chain, configureChains, createClient, useAccount, WagmiConfig } from "wagmi"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"
import { ChakraProvider } from "@chakra-ui/react"
import Head from 'next/head'
import { useEffect } from "react"


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
