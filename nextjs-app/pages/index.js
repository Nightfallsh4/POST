import styles from "../styles/Home.module.css"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount, useEnsName } from "wagmi"

export default function Home() {
	const { address, isConnected } = useAccount()

	return (
		<div className={styles.container}>
    <div className="flex justify-between mb-5">
			<h1 className="text-5xl">POST</h1>
			<ConnectButton />
      </div>
			{isConnected ? (
				<h2>connected to {address} </h2>
			) : (
				<h2>Not connetced to anything</h2>
			)}
		</div>
	)
}
