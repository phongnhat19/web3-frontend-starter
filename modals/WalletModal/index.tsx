import { AbstractConnector } from '@web3-react/abstract-connector'
import AccountDetails from 'app/components/AccountDetails'
import Button from 'app/components/Button'
import ExternalLink from 'app/components/ExternalLink'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import { ChainId } from 'app/config/chain'
import { injected, SUPPORTED_WALLETS } from 'app/config/wallet'
import { switchToNetwork } from 'app/functions/network'
import usePrevious from 'app/hooks/usePrevious'
import { useModalOpen, useWalletModalToggle } from 'app/state/application/hook'
import { ApplicationModal } from 'app/state/application/reducer'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { UnsupportedChainIdError, useWeb3React } from 'web3-react-core'

import Option from './Option'
import PendingView from './PendingView'

enum WALLET_VIEWS {
  OPTIONS,
  ACCOUNT,
  PENDING,
}

interface WalletModal {
  pendingTransactions: string[] // hashes of pending
  confirmedTransactions: string[] // hashes of confirmed
}

const WalletModal: FC<WalletModal> = ({ pendingTransactions, confirmedTransactions }) => {
  const { active, account, connector, activate, error, deactivate } = useWeb3React()

  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)
  const [pendingWallet, setPendingWallet] = useState<{ connector?: AbstractConnector; id: string }>()
  const [pendingError, setPendingError] = useState<boolean>()
  const walletModalOpen = useModalOpen(ApplicationModal.WALLET)
  const toggleWalletModal = useWalletModalToggle()
  const previousAccount = usePrevious(account)
  const activePrevious = usePrevious(active)
  const connectorPrevious = usePrevious(connector)

  const router = useRouter()
  const queryChainId = Number(router.query.chainId) || ChainId.KARDIACHAIN
  const cookieChainId = Cookies.get('chain-id')
  const defaultChainId = cookieChainId ? Number(cookieChainId) : ChainId.KARDIACHAIN
  // close on connection, when logged out before
  useEffect(() => {
    if (account && !previousAccount && walletModalOpen) toggleWalletModal()
  }, [account, previousAccount, toggleWalletModal, walletModalOpen])

  // always reset to account view
  useEffect(() => {
    if (walletModalOpen) {
      setPendingError(false)
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [walletModalOpen])

  useEffect(() => {
    if (walletModalOpen && ((active && !activePrevious) || (connector && connector !== connectorPrevious && !error))) {
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [setWalletView, active, error, connector, walletModalOpen, activePrevious, connectorPrevious])

  const handleSwitchNetwork = useCallback(async (chainId: number) => {
    const provider = await connector?.getProvider()
    if (!provider) return;
    switchToNetwork({
      provider,
      chainId: chainId
    })
  }, [connector])

  const handleBack = useCallback(() => {
    setPendingError(undefined)
    setWalletView(WALLET_VIEWS.ACCOUNT)
  }, [])

  const handleDeactivate = useCallback(() => {
    deactivate()
    setWalletView(WALLET_VIEWS.ACCOUNT)
  }, [deactivate])

  const tryActivation = useCallback(
    async (connector: (() => Promise<AbstractConnector>) | AbstractConnector | undefined, id: string) => {
      let name = ''
      let conn = typeof connector === 'function' ? await connector() : connector

      Object.keys(SUPPORTED_WALLETS).map((key) => {
        if (connector === SUPPORTED_WALLETS[key].connector) {
          return (name = SUPPORTED_WALLETS[key].name)
        }
      })

      console.debug('Attempting activation of', name)

      setPendingWallet({ connector: conn, id }) // set wallet for pending view
      setWalletView(WALLET_VIEWS.PENDING)

      if (conn) {
        console.debug('About to activate')
        activate(
          conn,
          (error) => {
            console.debug('Error activating connector ', name, error)
          },
          true
        )
          .then(async () => {
            console.debug('Activated, get provider')
          })

          .catch((error) => {
            console.debug('Error activating', error)
            if (error instanceof UnsupportedChainIdError) {
              // @ts-ignore TYPE NEEDS FIXING
              activate(conn) // a little janky...can't use setError because the connector isn't set
            } else {
              setPendingError(true)
            }
          })
      }
    },
    [activate, defaultChainId, queryChainId]
  )

  // get wallets user can switch too, depending on device/browser
  const options = useMemo(() => {
    // @ts-ignore
    const isMetamask = window.ethereum && window.ethereum.isMetaMask
    return Object.keys(SUPPORTED_WALLETS).map((key) => {
      const option = SUPPORTED_WALLETS[key]

      // check for mobile options
      if (isMobile) {

        if (!window.web3 && !window.ethereum && option.mobile) {
          return (
            <Option
              onClick={() => tryActivation(option.connector, key)}
              id={`connect-${key}`}
              key={key}
              active={option.connector && option.connector === connector}
              link={option.href}
              header={option.name}
              subheader={null}
              icon={'https://raw.githubusercontent.com' + '/kardia-solutions/kaidex-v3-tokens/master/wallet/' + option.iconName}
            />
          )
        }
        return null
      }

      // overwrite injected when needed
      if (option.connector === injected) {
        // don't show injected if there's no injected provider
        if (!(window.web3 || window.ethereum)) {
          if (option.name === 'MetaMask') {
            return (
              <Option
                id={`connect-${key}`}
                key={key}
                header={'Install Metamask'}
                subheader={null}
                link={'https://metamask.io/'}
                icon="https://raw.githubusercontent.com/kardia-solutions/kaidex-v3-tokens/master/wallet/metamask.png"
              />
            )
          } else {
            return null // dont want to return install twice
          }
        }
        // don't return metamask if injected provider isn't metamask
        else if (option.name === 'MetaMask' && !isMetamask) {
          return null
        }
        // likewise for generic
        else if (option.name === 'Injected' && isMetamask) {
          return null
        }
      }

      // return rest of options
      return (
        !isMobile &&
        !option.mobileOnly && (
          <Option
            id={`connect-${key}`}
            onClick={() => {
              option.connector === connector
                ? setWalletView(WALLET_VIEWS.ACCOUNT)
                : !option.href && tryActivation(option.connector, key)
            }}
            key={key}
            active={option.connector === connector}
            link={option.href}
            header={option.name}
            subheader={null} // use option.descriptio to bring back multi-line
            icon={'https://raw.githubusercontent.com/kardia-solutions/kaidex-v3-tokens/master/wallet/' + option.iconName}
          />
        )
      )
    })
  }, [connector, tryActivation])

  return (
    <HeadlessUiModal.Controlled isOpen={walletModalOpen} onDismiss={toggleWalletModal} maxWidth="md">
      {error ? (
        <div className="flex flex-col gap-4">
          <HeadlessUiModal.Header
            onClose={toggleWalletModal}
            header={error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error connecting'}
          />
          <HeadlessUiModal.BorderedContent>
            <span>
              {error instanceof UnsupportedChainIdError
                ? 'Unsupported network'
                : 'Error connecting. Try refreshing the page.'}
            </span>
          </HeadlessUiModal.BorderedContent>
          <Button onClick={() => handleSwitchNetwork(ChainId.KARDIACHAIN)} className="!bg-transparent text-primary" variant="outlined" size="xs">
            Switch to KardiaChain network
          </Button>
          <Button color="red" onClick={handleDeactivate}>
            Disconnect
          </Button>
        </div>
      ) : account && walletView === WALLET_VIEWS.ACCOUNT ? (
        <AccountDetails
          toggleWalletModal={toggleWalletModal}
          pendingTransactions={pendingTransactions}
          confirmedTransactions={confirmedTransactions}
          openOptions={() => setWalletView(WALLET_VIEWS.OPTIONS)}
        />
      ) : (
        <div className="flex flex-col w-full space-y-4">
          <HeadlessUiModal.Header
            header="Select a wallet"
            onClose={toggleWalletModal}
            {...(walletView !== WALLET_VIEWS.ACCOUNT && { onBack: handleBack })}
          />
          {walletView === WALLET_VIEWS.PENDING ? (
            <PendingView
              // @ts-ignore TYPE NEEDS FIXING
              id={pendingWallet.id}
              // @ts-ignore TYPE NEEDS FIXING
              connector={pendingWallet.connector}
              error={pendingError}
              setPendingError={setPendingError}
              tryActivation={tryActivation}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 overflow-y-auto md:grid-cols-2">{options}</div>
          )}
          <div className="flex justify-center">
            <Typography variant="xs" className="text-secondary" component="span">
              <Typography variant="xs" className="text-blue" component="span">
                <ExternalLink href="https://ethereum.org/wallets/" color="blue">
                  Learn more about wallets
                </ExternalLink>
              </Typography>
            </Typography>
          </div>
        </div>
      )}
    </HeadlessUiModal.Controlled>
  )
}

export default WalletModal
