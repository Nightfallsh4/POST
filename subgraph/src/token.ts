import { DropCreated as DropCreatedEvent } from "../generated/Token/Token"
import { Transfer as TransferEvent } from "../generated/templates/Soulbound/Soulbound"
import { Collection, Token, User } from "../generated/schema"
import {
	Soulbound as SoulboundDataSource,
	// ERC4973Rep as ERC4973RepDataSource,
} from "../generated/templates"

export function handleDropCreated(event: DropCreatedEvent): void {
	let entity = new Collection(
		event.transaction.hash.toHex() + "-" + event.logIndex.toString(),
	)
	entity.type = event.params.dropType
	entity.address = event.params.dropAddress
	entity.issuer = event.transaction.from
	entity.save()
	// if (event.params.dropType.toString()=== "Soulbound") {
	SoulboundDataSource.create(event.params.dropAddress)
	// } else if (event.params.dropType.toString() === "ERC4973Rep") {
	// ERC4973RepDataSource.create(event.params.dropAddress)
	// }
}

export function handleTransfer(event: TransferEvent): void {
	let entity = new Token(event.transaction.hash.toHex()+ "-" +event.params.tokenId.toString())
	entity.address = event.address
	entity.tokenId = event.params.tokenId
	entity.owner = event.params.to.toHexString()
	entity.save()

	let user = User.load(event.params.to.toHexString())
	if (!user) {
		user = new User(event.params.to.toHexString())
		user.save()
	}
}
