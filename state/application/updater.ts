import { useEffect, useState } from 'react'
import { ChainId } from '../../config/chain'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import useDebounce from '../../hooks/useDebounce'
import useIsWindowVisible from '../../hooks/useIsWindowVisible'

import { useAppDispatch } from '../hooks'
import { updateChainId } from './reducer'

/**
 * Returns the input chain ID if chain is supported. If not, return undefined
 * @param chainId a chain ID, which will be returned if it is a supported chain ID
 */
export function supportedChainId(chainId: number | undefined): ChainId | undefined {
  if (typeof chainId === 'number' && chainId in ChainId) {
    return chainId
  }
  return undefined
}

export default function Updater(): null {
  const { chainId, library } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const windowVisible = useIsWindowVisible()

  const [activeChainId, setActiveChainId] = useState(chainId)

  useEffect(() => {
    if (library && chainId && windowVisible) {
      setActiveChainId(chainId)
    }
  }, [dispatch, chainId, library, windowVisible])

  const debouncedChainId = useDebounce(activeChainId, 100)

  useEffect(() => {
    const chainId = debouncedChainId ? supportedChainId(debouncedChainId) ?? null : null
    dispatch(updateChainId({ chainId }))
  }, [dispatch, debouncedChainId])

  return null
}
