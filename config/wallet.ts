import { AbstractConnector } from '@web3-react/abstract-connector'
import { InjectedConnector } from 'web3-react-injected-connector'
import { NetworkConnector } from 'app/entities/connectors/NetworkConnector'
import RPC from './rpc'
import { CHAIN_ID } from './chain'

const supportedChainIds = Object.values([CHAIN_ID]) as number[]

let network: NetworkConnector | undefined

export const getNetworkConnector = (): NetworkConnector => {
  if (network) {
    return network
  }

  return (network = new NetworkConnector({
    defaultChainId: CHAIN_ID,
    urls: RPC,
  }))
}

export const injected = new InjectedConnector({
  supportedChainIds,
})

export interface WalletInfo {
  connector?: (() => Promise<AbstractConnector>) | AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'injected.png',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true,
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
  },
}
