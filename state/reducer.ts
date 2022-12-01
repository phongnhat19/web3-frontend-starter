import { combineReducers } from '@reduxjs/toolkit'
import multicall from './multicall'
import transactions from './transactions/reducer'
import application from './application/reducer'

const reducer = combineReducers({
  // multicall,
  multicall: multicall.reducer,
  transactions,
  application
})

export default reducer
