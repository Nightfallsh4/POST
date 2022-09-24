import { Center } from "@chakra-ui/react"
import Footer from "../components/Footer"
import Header from "../components/Header"
import { createClient } from "urql"
import Panel from "../components/panel"
import { useToast } from "@chakra-ui/react"
import { useEffect, useState } from "react"


export default function sbt() {
	const toast = useToast()
	const [data, setData] = useState()
   
	const apiUrl = "https://api.studio.thegraph.com/query/34828/post/0.0.15"
	const querySchema = `
        query{
                collections(
                  first: 10
                  orderBy: createdAt
                  orderDirection: desc
                ) {
                  id
                  name
                  type
                  issuer
                  uri
                  root
                }
        }    
    `

	const client = createClient({
		url: apiUrl,
	})
	async function fetchDataFromGraph() {
		const data1 = await client
			.query(querySchema)
			.toPromise()
			.then((result) => result)
		setData(data1.data.collections)
	}
	// const d = data.finally()
	useEffect(() => {
		fetchDataFromGraph()
	}, [])
	console.log(data)
	return (
		<div className="bg-[url('/bg.png')] h-full min-h-full">
			<Header />
			<div className=" bg-repeat-y">
				<h1 className="text-3xl my-14">
					<Center>Soulbound Tokens</Center>
				</h1>
				<div className="grid grid-cols-4 gap-4 mx-10">
					{data
						? data.map((sbt) => {
								return (
									<Panel
										name={sbt.name}
										uri={sbt.uri}
										type={sbt.type}
										issuer={sbt.issuer}
										id={sbt.id}
										root={sbt.root}
										toast={toast}
									/>
								)
						  })
						: null}
				</div>
			</div>
			<Footer />
		</div>
	)
}
