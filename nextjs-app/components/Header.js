import { Link } from "@chakra-ui/react"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export default function Header() {
	return (
		<div className="flex justify-between mb-5">
			<h1 className="text-5xl">POST</h1>
			<ConnectButton />
            
		</div>
	)
}
