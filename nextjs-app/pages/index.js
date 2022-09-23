import styles from "../styles/Home.module.css"
import { useAccount } from "wagmi"
import Header from "../components/Header"
import Footer from "../components/Footer"

export default function Home() {
	const { address, isConnected } = useAccount()

	return (
		<div>
			<Header/>
			<Footer/>
		</div>
	)
}
