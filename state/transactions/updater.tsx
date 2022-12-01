// import { DEFAULT_TXN_DISMISS_MS } from '../../constants'
import LibUpdater from '../../hooks/transactions/updater'
import { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'

import { checkedTransaction, finalizeTransaction } from './actions'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useAddPopup } from '../application/hook'
import { ChainId } from '../../config/chain'
import { DEFAULT_TXN_DISMISS_MS } from '../../constants'

export default function Updater() {
  const { chainId } = useActiveWeb3React()
  const addPopup = useAddPopup()
  const dispatch = useAppDispatch()

  const state = useAppSelector((state) => state.transactions)
  const transactions = useMemo(() => (chainId ? state[chainId as ChainId] ?? {} : {}), [chainId, state])
  const pendingTransactions = useMemo(() => (chainId ? state[chainId] ?? {} : {}), [chainId, state])

  const onCheck = useCallback(
    ({ chainId, hash, blockNumber }: any) => dispatch(checkedTransaction({ chainId, hash, blockNumber })),
    [dispatch]
  )

  const onReceipt = useCallback(
    ({ chainId, hash, receipt }: any) => {
      dispatch(
        finalizeTransaction({
          chainId,
          hash,
          receipt: {
            blockHash: receipt.blockHash,
            blockNumber: receipt.blockNumber,
            contractAddress: receipt.contractAddress,
            from: receipt.from,
            status: receipt.status,
            to: receipt.to,
            transactionHash: receipt.transactionHash,
            transactionIndex: receipt.transactionIndex,
          },
        })
      )
      addPopup(
        {
          txn: { hash, success: receipt.status === 1, summary: transactions[hash]?.summary },
        },
        hash,
        DEFAULT_TXN_DISMISS_MS
      )
    },
    [addPopup, dispatch, transactions]
  )

  return (
    <LibUpdater
      pendingTransactions={pendingTransactions}
      onCheck={onCheck}
      onReceipt={onReceipt}
    />
  )
}
