import Vue from 'vue'

const ensureNetworkWalletTree = (ref, network, walletId, initialValue) => {
  if (!ref[network]) Vue.set(ref, network, {})
  if (!ref[network][walletId]) Vue.set(ref[network], walletId, initialValue)
}

const ensureOriginWalletTree = (ref, walletId, origin, initialValue) => {
  if (!ref[walletId]) Vue.set(ref, walletId, {})
  if (!ref[walletId][origin]) Vue.set(ref[walletId], origin, initialValue)
}

export default {
  SETUP_WALLET (state, { key }) {
    state.key = key
    state.keyUpdatedAt = Date.now()
    state.setupAt = Date.now()
  },
  CREATE_WALLET (state, { keySalt, encryptedWallets, wallet, rskLegacyDerivation }) {
    state.encryptedWallets = encryptedWallets
    state.keySalt = keySalt
    state.wallets = [wallet]
    if (!state.accounts[wallet.id]) {
      Vue.set(state.accounts, wallet.id, {
        mainnet: [],
        testnet: []
      })
    }
    state.rskLegacyDerivation = rskLegacyDerivation
  },
  ACCEPT_TNC (state) {
    state.termsAcceptedAt = Date.now()
  },
  CHANGE_ACTIVE_WALLETID (state, { walletId }) {
    state.activeWalletId = walletId
  },
  CHANGE_ACTIVE_NETWORK (state, { network }) {
    state.activeNetwork = network
  },
  CHANGE_PASSWORD (state, { key, keySalt, encryptedWallets }) {
    state.key = key
    state.keySalt = keySalt
    state.encryptedWallets = encryptedWallets
    state.keyUpdatedAt = Date.now()
  },
  LOCK_WALLET (state) {
    state.key = null
    state.unlockedAt = null
    state.wallets = null
  },
  UNLOCK_WALLET (state, { key, wallets, unlockedAt }) {
    state.key = key
    state.wallets = wallets
    state.unlockedAt = unlockedAt
  },
  NEW_SWAP (state, { network, walletId, swap }) {
    ensureNetworkWalletTree(state.history, network, walletId, [])

    state.history[network][walletId].push(swap)
  },
  NEW_TRASACTION (state, { network, walletId, transaction }) {
    ensureNetworkWalletTree(state.history, network, walletId, [])

    state.history[network][walletId].push(transaction)
  },
  UPDATE_HISTORY (state, { network, walletId, id, updates }) {
    const item = state.history[network][walletId].find(i => i.id === id)
    Object.assign(item, updates)
  },
  REMOVE_ORDER (state, { network, walletId, id }) {
    Vue.set(state.history[network], walletId, state.history[network][walletId].filter(i => i.id !== id))
  },
  UPDATE_BALANCE (state, { network, accountId, walletId, asset, balance }) {
    const accounts = state.accounts[walletId][network]
    if (accounts) {
      const index = accounts.findIndex(
        (a) => a.id === accountId
      )

      if (index >= 0) {
        const _account = accounts[index]
        const balances = {
          ...accounts[index].balances,
          [asset]: balance
        }
        const updatedAccount = {
          ..._account,
          balances
        }

        Vue.set(state.accounts[walletId][network], index, updatedAccount)
      }
    }
  },
  UPDATE_FEES (state, { network, walletId, asset, fees }) {
    ensureNetworkWalletTree(state.fees, network, walletId, {})

    Vue.set(state.fees[network][walletId], asset, fees)
  },
  UPDATE_FIAT_RATES (state, { fiatRates }) {
    state.fiatRates = Object.assign({}, state.fiatRates, fiatRates)
  },
  UPDATE_MARKET_DATA (state, { network, marketData }) {
    Vue.set(state.marketData, network, marketData)
  },
  SET_ETHEREUM_INJECTION_CHAIN (state, { chain }) {
    state.injectEthereumChain = chain
  },
  ENABLE_ETHEREUM_INJECTION (state) {
    state.injectEthereum = true
  },
  DISABLE_ETHEREUM_INJECTION (state) {
    state.injectEthereum = false
  },
  ENABLE_ASSETS (state, { network, walletId, assets }) {
    ensureNetworkWalletTree(state.enabledAssets, network, walletId, [])
    state.enabledAssets[network][walletId].push(...assets)
  },
  DISABLE_ASSETS (state, { network, walletId, assets }) {
    ensureNetworkWalletTree(state.enabledAssets, network, walletId, [])
    Vue.set(state.enabledAssets[network], walletId, state.enabledAssets[network][walletId].filter(asset => !assets.includes(asset)))
  },
  DISABLE_ACCOUNT_ASSETS (state, { network, walletId, accountId, assets }) {
    const accounts = state.accounts[walletId][network]
    if (accounts) {
      const index = accounts.findIndex(
        (a) => a.id === accountId
      )

      if (index >= 0) {
        const _account = accounts[index]
        const { balances } = _account
        const balanceAssets = Object.keys(balances).filter(asset => assets.includes(asset))
        for (const asset of balanceAssets) {
          delete balances[asset]
        }
        const updatedAccount = {
          ..._account,
          balances,
          assets: _account.assets.filter(asset => !assets.includes(asset))
        }

        Vue.set(state.accounts[walletId][network], index, updatedAccount)
      }
    }
    Vue.set(state.enabledAssets[network], walletId, state.enabledAssets[network][walletId].filter(asset => !assets.includes(asset)))
  },
  ENABLE_ACCOUNT_ASSETS (state, { network, walletId, accountId, assets }) {
    const accounts = state.accounts[walletId][network]
    if (accounts) {
      const index = accounts.findIndex(
        (a) => a.id === accountId
      )

      if (index >= 0) {
        const _account = accounts[index]
        const updatedAccount = {
          ..._account,
          assets: [..._account.assets.filter(asset => !assets.includes(asset)), ...assets]
        }

        Vue.set(state.accounts[walletId][network], index, updatedAccount)
      }
    }
  },
  ADD_CUSTOM_TOKEN (state, { network, walletId, customToken }) {
    ensureNetworkWalletTree(state.customTokens, network, walletId, [])
    state.customTokens[network][walletId].push(customToken)
  },

  // ACCOUNTS
  CREATE_ACCOUNT (state, { network, walletId, account }) {
    if (!state.accounts[walletId]) {
      Vue.set(state.accounts, walletId, {
        [network]: []
      })
    }
    if (!state.accounts[walletId][network]) {
      Vue.set(state.accounts[walletId], network, [])
    }

    state.accounts[walletId][network].push(account)
  },
  UPDATE_ACCOUNT (state, { network, walletId, account }) {
    const {
      id,
      name,
      addresses,
      assets,
      balances,
      updatedAt
    } = account
    const accounts = state.accounts[walletId][network]
    if (accounts) {
      const index = accounts.findIndex(
        (a) => a.id === id
      )

      if (index >= 0) {
        const _account = accounts[index]
        const updatedAccount = {
          ..._account,
          name,
          addresses,
          balances,
          assets,
          updatedAt
        }

        Vue.set(state.accounts[walletId][network], index, updatedAccount)
      }
    }
  },
  REMOVE_ACCOUNT (state, { walletId, id, network }) {
    const accounts = state.accounts[walletId][network]

    if (accounts) {
      const index = accounts.findIndex(
        (account) => account.id === id
      )
      if (index >= 0) {
        const updatedAccounts = accounts.splice(index, 1)
        Vue.set(state.accounts[walletId], network, [...updatedAccounts])
      }
    }
  },
  UPDATE_ACCOUNT_ADDRESSES (state, { network, accountId, walletId, asset, addresses }) {
    const accounts = state.accounts[walletId][network]
    if (accounts) {
      const index = accounts.findIndex(
        (a) => a.id === accountId
      )

      if (index >= 0) {
        const _account = accounts[index]
        const updatedAccount = {
          ..._account,
          addresses: [...new Set(addresses)]
        }

        Vue.set(state.accounts[walletId][network], index, updatedAccount)
      }
    }
  },
  SAVE_PASSWORD (state, { password }) {
    state.tempPassword = password
  },
  SET_USE_LEDGER_LIVE (state, { use }) {
    state.useLedgerLive = use
  },
  SET_USB_BRIDGE_WINDOWS_ID (state, { id }) {
    state.usbBridgeWindowsId = id
  },
  ADD_EXTERNAL_CONNECTION (state, { origin, activeWalletId, accountId, chain }) {
    ensureOriginWalletTree(state.externalConnections, activeWalletId, origin, {})

    const accounts = state.externalConnections[activeWalletId]?.[origin]?.[chain] || []
    Vue.set(state.externalConnections[activeWalletId][origin], chain, [...new Set([...accounts, accountId])])
  },
  SET_ANALYTICS_PREFERENCES (state, payload) {
    state.analytics = {
      ...state.analytics,
      ...payload
    }
  },
  SET_WATS_NEW_MODAL_VERSION (state, { version }) {
    state.watsNewModalVersion = version
  }
}
