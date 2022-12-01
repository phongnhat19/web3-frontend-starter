import { ExclamationIcon } from '@heroicons/react/outline'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid'
import ExternalLink from 'app/components/ExternalLink'
import Loader from 'app/components/Loader'
import Typography from 'app/components/Typography'
import { ExternalLink as LinkIcon } from 'react-feather'
import { classNames, getExplorerLink } from 'app/functions'
import { isTxPending } from 'app/functions/transactions'
import { useActiveWeb3React } from 'app/services/web3'
import { useAllTransactions } from 'app/state/transactions/hooks'
import React, { FC } from 'react'

const Transaction: FC<{ hash: string }> = ({ hash }) => {
  const { chainId } = useActiveWeb3React()
  const allTransactions = useAllTransactions()

  const tx = allTransactions?.[hash]
  const summary = tx?.summary
  const pending = isTxPending(tx)
  const success = !pending && tx && (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined')
  const cancelled = tx?.receipt && tx.receipt.status === 1337

  if (!chainId) return null

  return (
    <div className="flex flex-col w-full py-1">
      <div className="flex gap-1">
        <ExternalLink href={getExplorerLink(chainId, hash, 'transaction')} className="flex flex-1 items-center gap-2">
          
          <div className={classNames(pending ? 'text-white' : success ? 'text-green' : 'text-red')}>
            {pending ? (
              <Loader />
            ) : success ? (
              <CheckCircleIcon width={16} height={16} />
            ) : cancelled ? (
              <XCircleIcon width={16} height={16} />
            ) : (
              <ExclamationIcon width={16} height={16} />
            )}
          </div>
          <Typography variant="xs" weight={700} className="flex flex-1 gap-1 items-center hover:underline py-0.5">
            {summary ?? hash}
          </Typography>
          <LinkIcon size={16} />
        </ExternalLink>
      </div>
    </div>
  )
}

export default Transaction
