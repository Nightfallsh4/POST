import {
	Image,
	Link,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
} from "@chakra-ui/react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"

export default function Header() {
	const { isConnected } = useAccount()
	return (
		<div className="flex justify-between bg-[#f7efe8] py-5 px-10 items-center drop-shadow-xl">
			<Link src="/">
				<Image src="Logo.png" boxSize="70px" borderRadius="full"></Image>
			</Link>
			<div className="flex justify-between items-center">
				<Link src="/" className="mr-28">
					<h2 className="hover:text-[#e88775]">Home</h2>
				</Link>
				<div className="mr-28">
					<Menu>
						<MenuButton>
							<h2>Issue</h2>
						</MenuButton>
						<MenuList>
							<MenuItem>
								<Link src="/issue">Soulbound</Link>
							</MenuItem>

							<MenuItem>
								<Link src="/issue">Reputation</Link>
							</MenuItem>

							<MenuItem>
								<Link src="/issue">Attestation</Link>
							</MenuItem>
						</MenuList>
					</Menu>
				</div>
				<Link src="/sbt" className="mr-28">
					<h2>SBTs</h2>
				</Link>
				{isConnected ? <Link src="/mySbts" className="mr-28">My SBTs</Link> : null}
				<ConnectButton />
			</div>
		</div>
	)
}
