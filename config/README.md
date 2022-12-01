# Chain and wallet support

By default, KardiaChain and Binance Smart Chain are supported (both mainnet and testnet). To add more network:
- Add new chain id in `chain.ts`
- Add RPC in `rpc.ts`
- Add chain config in `network.ts`

To add new wallet extension:
- Install the wallet's connector for `web3-react`, or create a custom connector.
- Add config to `wallet.ts`
