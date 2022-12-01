import { ChainId } from './chain'

const RPC = {
  [ChainId.KARDIACHAIN]: 'https://rpc.kardiachain.io',
  [ChainId.KARDIACHAIN_TESTNET]: 'https://dev.kardiachain.io',
  [ChainId.BSC]: 'https://bsc-dataseed1.binance.org',
  [ChainId.BSC_TESTNET]: 'https://data-seed-prebsc-1-s1.binance.org:8545/'
}

export default RPC
