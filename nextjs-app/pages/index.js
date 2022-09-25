import styles from "../styles/Home.module.css"
import { useAccount } from "wagmi"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { Center, Image } from "@chakra-ui/react"

export default function Home() {
	const { address, isConnected } = useAccount()

	return (
		<div>
			<Header />
			<div className="bg-[url('/bg.png')] p-36 flex justify-items items-center">
				<div className="w-3/5 ">
					<Center>
						<h1 className="text-6xl font-bold my-14">
							Proof Of Soulbound Token
						</h1>
					</Center>
					<p className="text-2xl font-['ALEGREYA']">
						POST is a DApp built to issue and mint EIP4973 Compatible Soulbound
						Tokens. A Decentralized Hyperstructure to issue soulbound tokens
						with many features with dynamic Reputation and Attestable Soulbound
						tokens
					</p>
				</div>
				<div>
					<Image src="/Logo.png" boxSize="500px" className="mx-72" />
				</div>
			</div>
			<div className="bg-[url('/2_bg_home.png')] p-36 flex justify-end text-[white]">
				<div className="w-1/2 text-right my-32">
					<h1 className="text-6xl my-14">
						Censorship Resistance and Immutable Hyperstructure
					</h1>
					<p className="text-2xl my-14 mb-36 font-['ALEGREYA']">
						Issue and Mint Censorship Resistant and Decentralized credential or
						achievements. Issuers can permit certain addresses to to add or
						reduce reputions of tokens. Users can request attestation from any
						address to attest to the credentials of their Tokens.
					</p>
				</div>
			</div>
			<div className="bg-[url('/3_bg_home.png')] p-36 flex">
				<div className="w-1/2 my-">
					<h1 className="text-6xl my-18 mt-12">
						Dynamic Reputation and Attestable Tokens
					</h1>

					<p className="text-2xl  my-24 mb-54 font-['ALEGREYA']">
						The current version of the Hyperstructure offers three variants of
						issueing Soulbound tokens (all three EIP-4973 Compatible), regular
						Soulbound tokens, Reputaion and Attestable.The Reputation version
						allows for the issuer to specify addresses which can addressescan
						modify the reputations of the tokens. The Attestable version allows
						users to request and receive attestation from wallet for their
						tokens.
					</p>
				</div>
			</div>
			<Footer />
		</div>
	)
}
