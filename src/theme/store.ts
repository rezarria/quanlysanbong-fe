import type AccountInfo from '@/model/AccountInfo'
import { create } from 'zustand'
interface State {
  accountInfo?: AccountInfo
}

interface Action {
  updateAccountInfo: (accountInfo: State['accountInfo']) => void
}

const useAccountStore = create<State & Action>((set) => ({
  accountInfo: undefined,
  updateAccountInfo: data => { set(() => ({ accountInfo: data })) }
}))

export { useAccountStore }
