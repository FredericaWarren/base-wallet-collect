# Base Wallet Collect

Base Wallet Collect is a polished Base mini app for reading and managing an ERC-20 contract.

It provides a simple interface for common contract actions on Base mainnet, including supply lookup, balance lookup, transfers, approvals, and delegated transfers.

## Overview

This project is designed to work with a deployed ERC-20 contract on Base mainnet.

It can be used to inspect contract data and submit supported write actions from a connected wallet.

The app is prepared for local development and deployment through a standard GitHub and Vercel workflow.

## Features

- Query total supply
- Query a wallet balance
- Send a transfer
- Approve spending
- Execute delegated `transferFrom`
- Base mini app metadata support
- Talent verification metadata support
- Transaction attribution tracking through `utils/track.js`

## Contract

- Address: `0x787382798015f84171081675bbd33d3590e29b3e`
- Network: Base mainnet

## Repository

Project repository:

https://github.com/FredericaWarren/base-wallet-collect.git

## Getting Started

Clone the repository:

```bash
git clone https://github.com/FredericaWarren/base-wallet-collect.git
cd base-wallet-collect
```

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

After the development server starts, open the local URL shown in your terminal.

## Usage

Use the app interface to connect a wallet and interact with the configured contract.

Available actions include reading total supply, checking a wallet balance, sending a transfer, approving spending, and calling delegated `transferFrom`.

Make sure your wallet is connected to Base mainnet before submitting write actions.

## Deployment

The app is ready for deployment with GitHub and Vercel.

The project includes metadata for Base mini app support, including `base:app_id`.

It also includes Talent verification metadata and transaction attribution tracking in `utils/track.js`.

## Project Notes

This app is configured for the contract address listed above.

If you change the contract address or network, review every place where contract configuration is used.

Always test changes locally before deploying.
