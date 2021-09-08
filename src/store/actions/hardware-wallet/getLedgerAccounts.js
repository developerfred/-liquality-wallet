
import { assets, chains as chainList } from '@liquality/cryptoassets'
export const getLedgerAccounts = async (
  { getters },
  { network, walletId, asset, accountType, startingIndex, numAccounts }
) => {
  const { client, networkAccounts } = getters
  const { chain } = assets[asset]
  const { formatAddress } = chainList[chain]
  const results = []
  const usedAddresses = []

  const existingAccounts = networkAccounts.filter(account => {
    return account.chain === chain
  })

  // get all the used addresses in the same chain
  for (const account of existingAccounts) {
    if (account.type.includes('ledger')) {
      usedAddresses.push(...account.addresses.map(address => formatAddress(address)))
    } else {
      const _client = client(
        {
          network,
          walletId,
          asset,
          accountId: account.id,
          useCache: false
        }
      )
      const addresses = await _client.wallet.getUsedAddresses()
      usedAddresses.push(...addresses.map(a => formatAddress(a.address)))
    }
  }

  const pageIndexes = [...Array(numAccounts || 5).keys()].map(i => i + startingIndex)
  for (const index of pageIndexes) {
    const _client = client(
      {
        network,
        walletId,
        asset,
        accountType,
        accountIndex: index,
        useCache: false
      }
    )
    const addresses = await _client.wallet.getAddresses()
    if (addresses && addresses.length > 0) {
      const formatedAddress = formatAddress(addresses[0].address)
      results.push({
        account: addresses[0],
        index,
        exists: usedAddresses.includes(formatedAddress)
      })
    }
  }
  return results
}
