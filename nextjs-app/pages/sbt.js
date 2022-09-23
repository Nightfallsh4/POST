import { Center } from "@chakra-ui/react"
import Footer from "../components/Footer"
import Header from "../components/Header"
import { createClient } from 'urql'
import Panel from "../components/panel"

export default function sbt() {
	const apiUrl = "https://api.studio.thegraph.com/query/34828/post/0.0.14"
	const querySchema = `
        query{
                collections(
                  first: 40
                  orderBy: createdAt
                  orderDirection: desc
                ) {
                  id
                  name
                  type
                  issuer
                  uri
                }
        }    
    `

	const client = createClient({
		url: apiUrl,
	})
    async function fetchDataFromGraph() {
        const data = await (await client.query(querySchema).toPromise()).data.collections
        return data
    }
    const data = fetchDataFromGraph()
    console.log(data)

	return (
		<div>
			<Header />
			<div>
				<h1 className="text-3xl">
					<Center>Soulbound Tokens</Center>
				</h1>
                <div>
                    {/* {data.map(() => {
                        
                    })} */}
                    <Panel name={"Something1"} uri="ipfs://bafybeibd4mxkyxhbsp2ydogwlqr5pfnyxqrcrfy3nmiano6mp7h3v7qfjq/HummingBird.jpg" type="Attest" issuer="0x5184116811616184qadsad4841"/>
                </div>
			</div>
			<Footer />
		</div>
	)
}
