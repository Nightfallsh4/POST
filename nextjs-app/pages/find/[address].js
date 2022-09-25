import { Center } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { createClient } from "urql"
import CirclePanel from "../../components/CirclePanel"
import Footer from "../../components/Footer"
import Header from "../../components/Header"

export default function findAddress() {
	const router = useRouter()
	const address = router.query.address
	const [data, setData] = useState()
	const apiUrl = "https://api.studio.thegraph.com/query/34828/post/0.0.15"
	let querySchema = `
        query{
            user (id: "${address ? address.toLowerCase() : null}"){
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
		fetchDataFromGraph()
	}, [address])

	console.log(data)

	return (
		<div className="bg-[url('/bg.png')] ">
			<Header />
			<div className="h-full min-h-full">
				<div className="mx-44 my-20">
					<Center>
						<div className="p-5 bg-[#d08290] rounded-xl">
							<h1 className="text-xl text-[white] font-bold">
								{address}
							</h1>
						</div>
					</Center>

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
				</div>
			</div>

			<Footer />
		</div>
	)
}
