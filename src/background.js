import 'setimmediate'
import { random } from 'lodash-es'
import store from './store'
import { wait } from './store/utils'

function asyncLoop (fn, delay) {
  return wait(delay())
    .then(() => fn())
    .then(() => asyncLoop(fn, delay))
}

const network = store.state

store.subscribe(async ({
  type,
  payload
}, state) => {
  switch (type) {
    case 'CHANGE_ACTIVE_NETWORK':
      store.dispatch('initializeAddresses', {
        network: state.activeNetwork,
        walletId: state.activeWalletId
      })
      store.dispatch('updateBalances', {
        network: state.activeNetwork,
        walletId: state.activeWalletId
      })
      store.dispatch('updateMarketData', { network: state.activeNetwork })

      store.dispatch('trackAnalytics', {
        event: `Network Changed ${network} to ${state.activeNetwork}`
      })

      break

    case 'UNLOCK_WALLET':
      store.dispatch('trackAnalytics', {
        event: 'Wallet Unlock',
        properties: {
          category: 'Unlock Wallet',
          action: 'Unlock Wallet',
          label: 'Unlock Wallet'
        }
      })
      store.dispatch('checkAnalyticsOptIn')
      store.dispatch('initializeAddresses', {
        network: state.activeNetwork,
        walletId: state.activeWalletId
      })
      store.dispatch('updateBalances', {
        network: state.activeNetwork,
        walletId: state.activeWalletId
      })
      store.dispatch('updateFiatRates', { assets: store.getters.allNetworkAssets })
      store.dispatch('updateMarketData', { network: state.activeNetwork })
      store.dispatch('checkPendingActions', { walletId: state.activeWalletId })

      store.commit('app/SET_USB_BRIDGE_TRANSPORT_CREATED', { created: false })
      store.commit('app/SET_USB_BRIDGE_CREATED', { created: false })

      asyncLoop(
        () => store.dispatch('updateBalances', {
          network: state.activeNetwork,
          walletId: state.activeWalletId
        }),
        () => random(400000, 600000)
      )

      asyncLoop(
        () => store.dispatch('updateFiatRates', { assets: Object.keys(state.fiatRates) }),
        () => random(40000, 60000)
      )

      asyncLoop(
        () => store.dispatch('updateMarketData', { network: state.activeNetwork }),
        () => random(40000, 60000)
      )

      break
    case 'NEW_SWAP':

      store.dispatch('trackAnalytics', {
        event: 'New SWAP',
        properties: {
          action: `Swap Created (${payload.swap.provider})`,
          category: `Create Swap on ${state.activeNetwork}`,
          label: `Swap ${payload.swap.from} to ${payload.swap.to}`
        }
      })

      break

    case 'LOCK_WALLET':
      store.dispatch('trackAnalytics', {
        event: 'Lock Wallet'
      })
      break
  }
})
