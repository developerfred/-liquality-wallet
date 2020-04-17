function getHostname () {
  try {
    return window.location.hostname
  } catch (e) {
    return self.location.hostname
  }
}

function getProtocol () {
  try {
    return window.location.protocol
  } catch (e) {
    return self.location.protocol
  }
}

const hostname = getHostname()

export const isApp = getProtocol().includes('file')

export const isAppOrExtension = getProtocol().includes('chrome') || isApp

export const isTestnet = isAppOrExtension || hostname.includes('testnet') || hostname === 'localhost'

export const network = isTestnet ? 'testnet' : 'mainnet'
