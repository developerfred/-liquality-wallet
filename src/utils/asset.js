import {
  chains,
  isEthereumChain as _isEthereumChain
} from '@liquality/cryptoassets'
import cryptoassets from '@/utils/cryptoassets'
import * as ethers from 'ethers'
import tokenABI from './tokenABI.json'
import buildConfig from '../build.config'

const EXPLORERS = {
  ethereum: {
    testnet: {
      tx: 'https://ropsten.etherscan.io/tx/0x',
      address: 'https://ropsten.etherscan.io/address/'
    },
    mainnet: {
      tx: 'https://etherscan.io/tx/0x',
      address: 'https://etherscan.io/address/'
    }
  },
  bitcoin: {
    testnet: {
      tx: 'https://blockstream.info/testnet/tx/',
      address: 'https://blockstream.info/testnet/address/'
    },
    mainnet: {
      tx: 'https://blockstream.info/tx/',
      address: 'https://blockstream.info/address/'
    }
  },
  rsk: {
    testnet: {
      tx: 'https://explorer.testnet.rsk.co/tx/0x',
      address: 'https://explorer.testnet.rsk.co/address/'
    },
    mainnet: {
      tx: 'https://explorer.rsk.co/tx/0x',
      address: 'https://explorer.rsk.co/address/'
    }
  },
  bsc: {
    testnet: {
      tx: 'https://testnet.bscscan.com/tx/',
      address: 'https://testnet.bscscan.com/address/'
    },
    mainnet: {
      tx: 'https://bscscan.com/tx/',
      address: 'https://bscscan.com/address/'
    }
  },
  polygon: {
    testnet: {
      tx: 'https://explorer-mumbai.maticvigil.com/tx/0x',
      address: 'https://explorer-mumbai.maticvigil.com/address/0x'
    },
    mainnet: {
      tx: 'https://explorer-mainnet.maticvigil.com/tx/0x',
      address: 'https://explorer-mainnet.maticvigil.com/address/0x'
    }
  },
  near: {
    testnet: {
      tx: 'https://explorer.testnet.near.org/transactions/',
      address: 'https://explorer.testnet.near.org/accounts/'
    },
    mainnet: {
      tx: 'https://explorer.mainnet.near.org/transactions/',
      address: 'https://explorer.mainnet.near.org/accounts/'
    }
  },
  arbitrum: {
    testnet: {
      tx: 'https://rinkeby-explorer.arbitrum.io/tx/0x',
      address: 'https://rinkeby-explorer.arbitrum.io/address/0x'
    },
    mainnet: {
      tx: 'https://explorer.arbitrum.io/tx/0x',
      address: 'https://explorer.arbitrum.io/address/0x'
    }
  }
}

export const isERC20 = asset => {
  return cryptoassets[asset]?.type === 'erc20'
}

export const isEthereumChain = asset => {
  const chain = cryptoassets[asset]?.chain
  return _isEthereumChain(chain)
}

export const isEthereumNativeAsset = asset => {
  const chainId = cryptoassets[asset]?.chain
  if (
    chainId &&
    _isEthereumChain(chainId) &&
    chains[chainId].nativeAsset === asset
  ) {
    return true
  }

  return false
}

export const getNativeAsset = asset => {
  const chainId = cryptoassets[asset]?.chain
  return chainId ? chains[chainId].nativeAsset : asset
}

export const getAssetColorStyle = asset => {
  const assetData = cryptoassets[asset]
  if (assetData && assetData.color) {
    return { color: assetData.color }
  }
  // return black as default
  return { color: '#000000' }
}

export const getTransactionExplorerLink = (hash, asset, network) => {
  const transactionHash = getExplorerTransactionHash(asset, hash)
  const chain = cryptoassets[asset].chain
  return `${EXPLORERS[chain][network].tx}${transactionHash}`
}

export const getAddressExplorerLink = (address, asset, network) => {
  const chain = cryptoassets[asset].chain
  return `${EXPLORERS[chain][network].address}${address}`
}

export const getAssetIcon = (asset, extension = 'svg') => {
  try {
    return require(`../assets/icons/assets/${asset.toLowerCase()}.${extension}?inline`)
  } catch (e) {
    try {
      return require(`../../node_modules/cryptocurrency-icons/svg/color/${asset.toLowerCase()}.svg?inline`)
    } catch (e) {
      return require('../assets/icons/blank_asset.svg?inline')
    }
  }
}

export const getExplorerTransactionHash = (asset, hash) => {
  switch (asset) {
    case 'NEAR':
      return hash.split('_')[0]
    default:
      return hash
  }
}

export const tokenDetailProviders = {
  ethereum: {
    async getDetails (contractAddress) {
      return await fetchTokenDetails(contractAddress, `https://mainnet.infura.io/v3/${buildConfig.infuraApiKey}`)
    }
  },
  polygon: {
    async getDetails (contractAddress) {
      return await fetchTokenDetails(contractAddress, 'https://rpc-mainnet.matic.network/')
    }
  },
  rsk: {
    async getDetails (contractAddress) {
      return await fetchTokenDetails(contractAddress, 'https://public-node.rsk.co')
    }
  },
  bsc: {
    async getDetails (contractAddress) {
      return await fetchTokenDetails(contractAddress, 'https://bsc-dataseed.binance.org')
    }
  }
}

const fetchTokenDetails = async (contractAddress, rpcUrl) => {
  const provider = new ethers.providers.StaticJsonRpcProvider(rpcUrl)
  const contract = new ethers.Contract(contractAddress.toLowerCase(), tokenABI, provider)

  const [decimals, name, symbol] = await Promise.all([
    contract.decimals(),
    contract.name(),
    contract.symbol()
  ])

  return { decimals, name, symbol }
}
