import { TransactionReceipt, TransactionResponse } from '@ethersproject/abstract-provider'
import { atomWithImmer } from 'jotai/immer'

export enum TransactionType {
  APPROVAL,
  SWAP,
  WRAP,
}

interface BaseTransactionInfo {
  type: TransactionType
  response: TransactionResponse
}

export interface ApprovalTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.APPROVAL
  tokenAddress: string
  spenderAddress: string
}

export interface WrapTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.WRAP
  unwrapped: boolean
  currencyAmountRaw: string
  chainId?: number
}

export type TransactionInfo = ApprovalTransactionInfo | WrapTransactionInfo

export interface Transaction<T extends TransactionInfo = TransactionInfo> {
  addedTime: number
  lastCheckedBlockNumber?: number
  receipt?: TransactionReceipt
  info: T
}

export const transactionsAtom = atomWithImmer<{
  [chainId: string]: { [hash: string]: Transaction }
}>({})
