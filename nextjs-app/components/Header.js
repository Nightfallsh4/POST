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
			<Link href="/">
				<Image src="/Logo.png" boxSize="70px" borderRadius="full"></Image>
			</Link>
			<div className="flex justify-between items-center">
				<Link href="/" className="mr-28">
					<h2 className="hover:text-[#e88775]">Home</h2>
				</Link>
				<div className="mr-28">
					<Menu>
						<MenuButton className="hover:text-[#e88775]">
							<h2 >Issue</h2>
						</MenuButton>
						<MenuList>
							<MenuItem>
								<Link href="/issue">Soulbound</Link>
							</MenuItem>

							<MenuItem>
								<Link href="/issueRep">Reputation</Link>
							</MenuItem>

							<MenuItem>
								<Link href="/issueAttest">Attestation</Link>
							</MenuItem>
						</MenuList>
					</Menu>
				</div>
				<Link href="/sbt" className="mr-28">
					<h2 className="hover:text-[#e88775]">SBTs</h2>
				</Link>
				{isConnected ? <Link href="/mySbts" className="mr-28"><h2 className="hover:text-[#e88775]">My SBTs</h2></Link> : null}
				<ConnectButton />
			</div>
		</div>
	)
}
