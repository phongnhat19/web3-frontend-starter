import { classNames } from 'app/functions'
import { useWalletModalToggle } from 'app/state/application/hook'
import React from 'react'
import { Activity } from 'react-feather'
import { UnsupportedChainIdError, useWeb3React } from 'web3-react-core'

import Button, { ButtonProps } from '../Button'

export default function Web3Connect({ color = 'blue', size, className = '', ...rest }: ButtonProps) {
  const toggleWalletModal = useWalletModalToggle()
  const { error } = useWeb3React()
  
  if (error) {
    console.log(error)
  } else {
    console.log('123')
  }
  
  return error ? (
    <div
      className="flex items-center justify-center px-4 py-2 font-semibold text-white border rounded bg-opacity-80 border-red bg-red hover:bg-opacity-100"
      onClick={toggleWalletModal}
    >
      <div className="mr-1">
        <Activity className="w-4 h-4" />
      </div>
      {error instanceof UnsupportedChainIdError ? 'You are on the wrong network' : 'Error'}
    </div>
  ) : (
    <Button
      id="connect-wallet"
      onClick={toggleWalletModal}
      color={color}
      className={classNames(className, '!border-none')}
      size={size}
      {...rest}
    >
      Connect to a wallet
    </Button>
  )
}
