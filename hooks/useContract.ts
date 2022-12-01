import { Contract } from '@ethersproject/contracts'
import { useMemo } from 'react'
import { getContract } from 'app/functions/contract'
import useActiveWeb3React from './useActiveWeb3React'
import MULTICALL_ABI from 'app/constants/abis/multicall.json'
import ERC20_ABI from 'app/constants/abis/erc20.json';
import { ChainId } from '../config/chain'

const MULTICALL_ADDRESS: Record<number, string> = {
  [ChainId.KARDIACHAIN_TESTNET]: '0x5A14ebF0440A9ac0b65B4e8F847337C07451cbbd',
  [ChainId.BSC]: '0x6E6B5e44FD66371bCf2c1342bBeb9e3048393073'
}

// returns null on errors
export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: any,
  withSignerIfPossible = true
): T | null {
  const { library, account, chainId } = useActiveWeb3React()
  
  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !library || !chainId) return null
    let address: string | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else if (chainId) address = addressOrAddressMap[chainId]

    if (!address) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, ABI, library, chainId, withSignerIfPossible, account]) as T
}

export function useInterfaceMulticall(): Contract | null | undefined {
  return useContract(MULTICALL_ADDRESS, MULTICALL_ABI, false)
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}