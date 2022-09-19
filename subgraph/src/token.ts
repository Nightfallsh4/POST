import { DropCreated as DropCreatedEvent } from "../generated/Token/Token"
import { Transfer as TransferEvent, Soulbound as SoulboundContract } from "../generated/templates/Soulbound/Soulbound"
import { Collection, Token, User } from "../generated/schema"
import {
	Soulbound as SoulboundDataSource,
	// ERC4973Rep as ERC4973RepDataSource,
} from "../generated/templates"

export function handleDropCreated(event: DropCreatedEvent): void {
	let entity = new Collection(
		event.params.dropAddress.toHexString(),
	)
	entity.type = event.params.dropType
	entity.address = event.params.dropAddress
	entity.issuer = event.transaction.from
	let contract = SoulboundContract.bind(event.params.dropAddress)
	entity.name = contract.name()
	entity.uri = contract.uri()
	entity.save()
	SoulboundDataSource.create(event.params.dropAddress)
}

export function handleTransfer(event: TransferEvent): void {
	let entity = new Token(event.transaction.hash.toHex()+ "-" +event.params.tokenId.toString())
	entity.address = event.address
	entity.tokenId = event.params.tokenId
	entity.owner = event.params.to.toHexString()
	entity.collection = event.address.toHexString()
	entity.save()

	let user = User.load(event.params.to.toHexString())
	if (!user) {
		user = new User(event.params.to.toHexString())
		user.save()
	}
}
