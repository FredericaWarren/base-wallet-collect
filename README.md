# Base Wallet Collect

Base Wallet Collect is a polished Base mini app for reading and managing an ERC-20 contract:

- Total supply query
- Wallet balance query
- Token transfer
- Approval
- Delegated `transferFrom`

## Contract

- Address: `0x787382798015f84171081675bbd33d3590e29b3e`
- Network: Base mainnet

## Local development

```bash
npm install
npm run dev
```

## Deployment

The app is ready for GitHub + Vercel deployment and includes:

- `base:app_id` metadata
- Talent verification metadata
- Transaction attribution tracking in `utils/track.js`
