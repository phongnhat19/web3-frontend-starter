import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from 'web3-react-core'

export function useActiveWeb3React() {
  // if (process.env.REACT_APP_IS_WIDGET) {
  //   return useWidgetsWeb3React()
  // }

  const interfaceContext = useWeb3React<Web3Provider>()
  const interfaceNetworkContext = useWeb3React<Web3Provider>()

  if (interfaceContext.active) {
    return interfaceContext
  }

  return interfaceNetworkContext
}

export default useActiveWeb3React
