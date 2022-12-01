import { HeadlessUiModal } from 'app/components/Modal'
import Identicon from 'react-blockies'
import { injected, SUPPORTED_WALLETS } from 'app/config/wallet'
import { getExplorerLink } from 'app/functions/explorer'
import { shortenAddress } from 'app/functions/format'
import { useActiveWeb3React } from 'app/services/web3'
import { useAppDispatch } from 'app/state/hooks'
import { clearAllTransactions } from 'app/state/transactions/actions'
import React, { FC, useCallback, useMemo } from 'react'
import { ExternalLink as LinkIcon } from 'react-feather'
// import { WalletLinkConnector } from 'web3-react-walletlink-connector'

import Button from '../Button'
import Divider from '../Divider'
import ExternalLink from '../ExternalLink'
import Typography from '../Typography'
import Copy from './Copy'
import Transaction from './Transaction'

interface AccountDetailsProps {
  toggleWalletModal: () => void
  pendingTransactions: string[]
  confirmedTransactions: string[]
  openOptions: () => void
}

const AccountDetails: FC<AccountDetailsProps> = ({
  toggleWalletModal,
  pendingTransactions,
  confirmedTransactions,
  openOptions,
}) => {
  const { chainId, account, connector, deactivate, library } = useActiveWeb3React()
  const dispatch = useAppDispatch()

  const isMetaMask = useMemo(() => {
    const { ethereum } = window
    // @ts-ignore
    return !!(ethereum && ethereum.isMetaMask)
  }, [])

  const isCoin98 = useMemo(() => {
    const { ethereum } = window
    // @ts-ignore
    return !!(ethereum && ethereum.isCoin98)
  }, [])

  const connectorName = useMemo(() => {
    const name = Object.keys(SUPPORTED_WALLETS)
      .filter(
        (k) =>
          SUPPORTED_WALLETS[k].connector === connector && (connector !== injected || isMetaMask === (k === 'METAMASK'))
      )
      .map((k) => SUPPORTED_WALLETS[k].name)[0]
    return (
      <Typography variant="xs" weight={700} className="text-white/[.52]">
        Connected with {name}
      </Typography>
    )
  }, [connector, isMetaMask])

  const connectorAvatar = useMemo(() => {
    let name = Object.keys(SUPPORTED_WALLETS)
      .filter(
        (k) =>
          SUPPORTED_WALLETS[k].connector === connector && (connector !== injected || isMetaMask === (k === 'METAMASK'))
      )
      .map((k) => SUPPORTED_WALLETS[k].iconName)[0]
    if (!name) return ''
    if (isCoin98) name = SUPPORTED_WALLETS.COIN98_EXTENSION.iconName
    return 'https://raw.githubusercontent.com' + '/kardia-solutions/kaidex-v3-tokens/master/wallet/' + name;
  }, [connector, isMetaMask, isCoin98])

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }))
  }, [dispatch, chainId])

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        <HeadlessUiModal.Header header="Account" onClose={toggleWalletModal} />
        <HeadlessUiModal.Content className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            {/* {connectorName} */}
            {/* {connector !== injected && !(connector instanceof WalletLinkConnector) && (
              <Button variant="outlined" color="blue" size="xs" onClick={deactivate}>
                {i18n._(t`Disconnect`)}
              </Button>
            )} */}
            <Button variant="outlined" color="blue" size="xs" onClick={deactivate}>
              Disconnect
            </Button>
          </div>
          <div id="web3-account-identifier-row" className="flex flex-col justify-center gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="overflow-hidden rounded-full border-primary border-[2px]">
                  {account && (
                    <Identicon seed={account} size={8} className="rounded-full" />
                  )}
                </div>
                <div
                  className="absolute p-[4px] rounded-full border-white border-[2px] right-0 bottom-0 bg-accent-900"
                >
                  <img
                    src={connectorAvatar}
                    className="w-[13px] h-[13px]"
                    alt={account || 'Metamask connector'}
                  />
                </div>
              </div>
              <div className="flex flex-col justify-between h-full">
                <Typography weight={700} variant="lg" className="text-white">
                  {account && shortenAddress(account)}
                </Typography>
                {account && (
                  <div className="flex items-center mt-[8px]">
                    <Copy toCopy={account}>
                      <Typography variant="xs" weight={700}>
                        Copy Address
                      </Typography>
                    </Copy>
                    <Divider vertical className="w-px h-[12px] mx-[4px] sm:mx-[12px] bg-accent-200" />
                    <ExternalLink
                      color="blue"
                      startIcon={<LinkIcon size={16} />}
                      href={getExplorerLink(chainId, account, 'address')}
                    >
                      <Typography variant="xs" weight={700}>
                        View on explorer
                      </Typography>
                    </ExternalLink>
                  </div>
                )}
              </div>
            </div>
          </div>
        </HeadlessUiModal.Content>
        <div className="flex items-center justify-between">
          <Typography variant="xs" weight={700} className="text-white/[.52]">
            Recent Transactions
          </Typography>
          <Button variant="filled" color="secondary" size="xs" onClick={clearAllTransactionsCallback}>
            Clear all
          </Button>
        </div>
        <HeadlessUiModal.BorderedContent className="flex flex-col gap-3 bg-black/40 border-transparent py-[14px] px-[16px]">
          <div className="flex flex-col divide-y divide-dark-800">
            {!!pendingTransactions.length || !!confirmedTransactions.length ? (
              <>
                {pendingTransactions.map((el, index) => (
                  <Transaction key={index} hash={el} />
                ))}
                {confirmedTransactions.map((el, index) => (
                  <Transaction key={index} hash={el} />
                ))}
              </>
            ) : (
              <Typography variant="xs" weight={700} className="text-white/[.52]">
                Your transactions will appear here...
              </Typography>
            )}
          </div>
        </HeadlessUiModal.BorderedContent>
      </div>
    </div>
  )
}

export default AccountDetails
