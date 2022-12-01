import { ChainId } from '../config/chain'

export const DEFAULT_TXN_DISMISS_MS = 25000

export const NATIVE_SYMBOL: Record<number, string> = {
  [ChainId.KARDIACHAIN]: 'KAI',
  [ChainId.KARDIACHAIN_TESTNET]: 'KAI',
  [ChainId.BSC]: 'BNB',
  [ChainId.BSC_TESTNET]: 'BNB'
}
