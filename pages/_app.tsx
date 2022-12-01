import '../styles/globals.css'
import dynamic from 'next/dynamic'
import { Web3ReactProvider } from 'web3-react-core'
import Web3ReactManager from 'app/components/Web3ReactManager'
import store from 'app/state'
import getLibrary from 'app/functions/getLibrary'
import { Provider as ReduxProvider } from 'react-redux'
import type { AppProps } from 'next/app'
import { BlockUpdater } from 'app/hooks/useBlockNumber'
import { MulticallUpdater } from 'app/state/multicall'
import TransactionUpdater from 'app/state/transactions/updater'
import ApplicationUpdater from 'app/state/application/updater'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
      />
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ReactManager>
          <ReduxProvider store={store}>
            <>
              <ApplicationUpdater />
              <TransactionUpdater />
              <BlockUpdater />
              <MulticallUpdater />
            </>
            <Component {...pageProps} />
          </ReduxProvider>
        </Web3ReactManager>
      </Web3ReactProvider>
    </>
  )
}
