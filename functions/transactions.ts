import { TransactionDetails } from 'app/state/transactions/reducer'

export function isTxPending(tx?: TransactionDetails): boolean {
  return !tx?.receipt
}

export function isTxConfirmed(tx: TransactionDetails): boolean {
  return !isTxPending(tx)
}
