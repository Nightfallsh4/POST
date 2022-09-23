import { Center } from "@chakra-ui/react"
import Footer from "../components/Footer"
import Header from "../components/Header"

export default function sbt() {
	return (
		<div>
			<Header />
			<div>
				<h1 className="text-3xl">
					<Center>Soulbound Tokens</Center>
				</h1>
			</div>
			<Footer />
		</div>
	)
}
