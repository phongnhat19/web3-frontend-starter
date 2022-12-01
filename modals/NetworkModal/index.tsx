import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import { ChainId } from 'app/config/chain'
import { NETWORK_ICON, NETWORK_LABEL, SUPPORTED_NETWORKS } from 'app/config/networks'
import { classNames } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { useModalOpen, useNetworkModalToggle } from 'app/state/application/hook'
import { ApplicationModal } from 'app/state/application/reducer'
import Image from 'next/image'
import React, { FC } from 'react'

export const getNetworkName = (chainId: number) => {
  const chainConfig = SUPPORTED_NETWORKS[chainId];

  return chainConfig.chainName
}

export const SUPPORTED_NETWORKS_ARRAY = Object.values(SUPPORTED_NETWORKS)

const NetworkModal: FC = () => {
  const { chainId, library, account } = useActiveWeb3React()
  const networkModalOpen = useModalOpen(ApplicationModal.NETWORK)
  const toggleNetworkModal = useNetworkModalToggle()

  if (!chainId) return null

  return (
    <HeadlessUiModal.Controlled isOpen={networkModalOpen} onDismiss={toggleNetworkModal}>
      <div className="flex flex-col gap-4">
        <HeadlessUiModal.Header header="Select a network" onClose={toggleNetworkModal} />
        <div className="grid grid-flow-row-dense grid-cols-1 gap-4 overflow-y-auto md:grid-cols-2">
          {[
            ChainId.KARDIACHAIN,
            ChainId.BSC
          ]
            .sort((key) => (chainId === key ? -1 : 0))
            .map((key: number, i: number) => {
              if (chainId === key) {
                return (
                  <div
                    key={i}
                    className="bg-[rgba(0,0,0,0.2)] focus:outline-none flex items-center gap-4 w-full px-4 py-3 rounded border border-purple cursor-default"
                  >
                    <Image
                      // @ts-ignore TYPE NEEDS FIXING
                      src={NETWORK_ICON[key]}
                      alt="Switch Network"
                      className="rounded-full"
                      width={32}
                      height={32}
                    />
                    <Typography weight={700} className="text-high-emphesis">
                      {NETWORK_LABEL[key]}
                    </Typography>
                  </div>
                )
              }
              return (
                <button
                  key={i}
                  onClick={async () => {
                    console.debug(`Switching to chain ${key}`, SUPPORTED_NETWORKS[key])
                    toggleNetworkModal()
                    const params = SUPPORTED_NETWORKS[key]
                    try {
                      await library?.send('wallet_switchEthereumChain', [{ chainId: `0x${key.toString(16)}` }, account])

                    } catch (switchError) {
                      // This error code indicates that the chain has not been added to MetaMask.
                      // @ts-ignore TYPE NEEDS FIXING
                      if (switchError.code === 4902) {
                        try {
                          await library?.send('wallet_addEthereumChain', [params, account])
                        } catch (addError) {
                          // handle "add" error
                          console.error(`Add chain error ${addError}`)
                        }
                      }
                      console.error(`Switch chain error ${switchError}`)
                      // handle other "switch" errors
                    }
                  }}
                  className={classNames(
                    'bg-[rgba(0,0,0,0.2)] focus:outline-none flex items-center gap-4 w-full px-4 py-3 rounded border border-dark-700 hover:border-blue'
                  )}
                >
                  {/*@ts-ignore TYPE NEEDS FIXING*/}
                  <Image
                    src={NETWORK_ICON[key]}
                    alt="Switch Network"
                    className="rounded-full"
                    width={32}
                    height={32}
                  />
                  <Typography weight={700} className="text-high-emphesis">
                    {NETWORK_LABEL[key]}
                  </Typography>
                </button>
              )
            })}
        </div>
      </div>
    </HeadlessUiModal.Controlled>
  )
}

export default NetworkModal
