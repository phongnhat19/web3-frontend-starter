import { ChainId } from "./chain";
import RPC from "./rpc";

const KardiaLogo = 'https://raw.githubusercontent.com/kardiachain/token-assets/master/logos/kardia-logo.png';
const BSCLogo = 'https://bscscan.com/images/svg/brands/bnb.svg?v=1.3'

export const NETWORK_ICON: Record<number, string> = {
  [ChainId.KARDIACHAIN]: KardiaLogo,
  [ChainId.KARDIACHAIN_TESTNET]: KardiaLogo,
  [ChainId.BSC]: BSCLogo,
  [ChainId.BSC_TESTNET]: BSCLogo
}

export const NETWORK_LABEL: Record<number, string> = {
  [ChainId.KARDIACHAIN]: 'KardiaChain',
  [ChainId.KARDIACHAIN_TESTNET]: 'KardiaChain testnet',
  [ChainId.BSC]: 'BSC',
  [ChainId.BSC_TESTNET]: 'BSC testnet',
}

export interface NetworkMeta {
  chainId: string
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: string[]
  blockExplorerUrls: string[]
  isTestnet?: boolean,
}

export const SUPPORTED_NETWORKS: Record<
  number,
  NetworkMeta
> = {
  [ChainId.KARDIACHAIN]: {
    chainId: ChainId.KARDIACHAIN.toString(16),
    chainName: 'KardiaChain',
    nativeCurrency: {
      name: 'KardiaChain',
      symbol: 'KAI',
      decimals: 18,
    },
    rpcUrls: [RPC[ChainId.KARDIACHAIN]],
    blockExplorerUrls: ['https://explorer.kardiachain.io'],
  },
  [ChainId.KARDIACHAIN_TESTNET]: {
    chainId: ChainId.KARDIACHAIN_TESTNET.toString(16),
    chainName: 'KardiaChain Testnet',
    nativeCurrency: {
      name: 'KardiaChain',
      symbol: 'KAI',
      decimals: 18,
    },
    rpcUrls: [RPC[ChainId.KARDIACHAIN_TESTNET]],
    blockExplorerUrls: ['https://bc-dev.kardiachain.io'],
    isTestnet: true,
  },
  [ChainId.BSC]: {
    chainId: ChainId.BSC.toString(16),
    chainName: 'BSC',
    nativeCurrency: {
      name: 'BSC',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: [RPC[ChainId.BSC]],
    blockExplorerUrls: ['https://bscscan.com/'],
  },
  [ChainId.BSC_TESTNET]: {
    chainId: ChainId.BSC_TESTNET.toString(16),
    chainName: 'BSC Testnet',
    nativeCurrency: {
      name: 'BSC Testnet',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: [RPC[ChainId.BSC_TESTNET]],
    blockExplorerUrls: ['https://testnet.bscscan.com/'],
    isTestnet: true,
  }
}
