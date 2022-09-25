import Footer from "../components/Footer"
import Header from "../components/Header"
import { useAccount } from "wagmi"
import { createClient } from "urql"
import { useEffect, useState } from "react"
import CirclePanel from "../components/CirclePanel"
import { Center } from "@chakra-ui/react"

export default function mySbts() {
	const { address, isConnected } = useAccount()
	const [data, setData] = useState()
	const apiUrl = "https://api.studio.thegraph.com/query/34828/post/0.0.15"
	let querySchema = `
        query{
            user (id: "${isConnected ? address.toLowerCase() : null}"){
                id
              tokens(orderBy: tokenId){
              tokenId
              collection{
                name
                uri
                type
                issuer
                address
              }
              }
          }
        }
    `
	console.log(querySchema)
	const client = createClient({
		url: apiUrl,
	})
	async function fetchDataFromGraph() {
		const data1 = await client
			.query(querySchema)
			.toPromise()
			.then((result) => result)
		setData(data1.data.user)
		// setName(data1.data.user)
	}
	// const d = data.finally()

	useEffect(() => {
		if (isConnected) {
			const add = address.toLocaleLowerCase()
			fetchDataFromGraph()
		}
	}, [address])

	console.log(data)

	return (
		<div className="bg-[url('/bg.png')] ">
			<Header />
			<div className="h-full min-h-full">
				<div className="mx-44 my-20">
					<h1 className="text-4xl font-bold">Your Soulbound Tokens</h1>
					{isConnected ? (
						<div className="grid grid-cols-4 gap-4 ">
							{data
								? data.tokens.map((dat) => {
										return (
											<CirclePanel
												name={data ? dat.collection.name : null}
												type={data ? dat.collection.type : null}
												tokenId={data ? dat.tokenId : null}
												address={data ? dat.collection.address : null}
												issuer={data ? dat.collection.issuer : null}
												uri={data ? dat.collection.uri : null}
											/>
										)
								  })
								: null}
						</div>
					) : (
						<div className="">
							<Center>
								<div className="p-16  my-64 bg-[#7d769b] rounded-[50px]">
								<h1 className="text-5xl text-[white]">Click Connect Wallet</h1></div>
							</Center>
						</div>
					)}
				</div>
			</div>

			<Footer />
		</div>
	)
}
