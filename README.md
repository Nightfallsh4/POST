# Proof of Soulbound Token (POST)

## **Introduction**

Proof of Soulbound Token (POST) is a DApp built to make soulbound token contracts with dynamic reputation and attestation capabilities.

## **Getting Started**

### For Users:


The Live Demo of the Dapp can be used and viewed [proofofsoulboundtoken.vercel.app](https://proofofsoulboundtoken.vercel.app). The Contracts are live on the Goerli Testnet. You might need to get some goerliETH from any of the faucets if you dont have it. You can get some goerliETH from faucets [here](https://goerli.net/).


### For Developers:

Prerequisites: 
- node version: 16.0.0 or above
- API key for web3Storage in nextjs-app/.env.local as NEXT_PUBLIC_WEB3_STORAGE

Install the packages:

```
yarn install
```

Once all packages installed, to start the front-end

```
yarn dev
```
Now the front-end should be available at [localhost:3000](http://localhost:3000).

## **How it works:**

The Dapp consists of an entry contract called [POST Factory](https://goerli.etherscan.io/address/0x3e646acfdaa901239a72f86a79bf1ae93b2596ee). It has four functions to create Soulbound token contracts with different features and withdraw creating fees.

For creating each type of the SBT contracts, the POST factory calls their seperate factory contract. The seperate factory contract creates a new SBT token contract and returns the minted address to POST factory and POST factory emits an event.

### Types of SBT Contracts:

There are currently three types of Soulbound contracts available to mint in the Dapp. They are 
1. Soulbound token
2. Reputation Soulbound token
3. Attestation Soulbound token

Reputatation Soulbound tokens have a dynamic reputation attached to them. The issuer of the SBT can authorise any address to increase or decrease reputation of individual tokens by a pre-defined increment for an specified time.

Attestation Soulbound Tokens can attested by addresses. The owner of a SBT can authorise an address to attest their SBT.

