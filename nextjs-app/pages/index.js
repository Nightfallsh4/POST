import styles from "../styles/Home.module.css"
import { useAccount } from "wagmi"
import Header from "../components/Header"

export default function Home() {
	const { address, isConnected } = useAccount()

	return (
		<div>
			<Header/>
			{isConnected ? (
				<h2>connected to {address} </h2>
			) : (
				<h2>Not connetced to anything</h2>
			)}
		</div>
	)
}
