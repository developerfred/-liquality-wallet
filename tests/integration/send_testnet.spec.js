const TestUtil = require('../utils/TestUtils')
const OverviewPage = require('../Pages/OverviewPage')
const HomePage = require('../Pages/HomePage')
const PasswordPage = require('../Pages/PasswordPage')
const SearchAssetPage = require('../Pages/SearchAssetPage')
const SendPage = require('../Pages/SendPage')
const TransactionDetailsPage = require('../Pages/TransactionDetailsPage')
const TestDataUtils = require('../utils/TestDataUtils')
const expect = require('chai').expect
const chalk = require('chalk')

const puppeteer = require('puppeteer')

const testUtil = new TestUtil()
const testDataUtils = new TestDataUtils()
const overviewPage = new OverviewPage()
const homePage = new HomePage()
const passwordPage = new PasswordPage()
const searchAssetPage = new SearchAssetPage()
const sendPage = new SendPage()
const transactionDetailsPage = new TransactionDetailsPage()

let browser, page
const password = '123123123'

describe('Liquality wallet SEND feature', async () => {
  beforeEach(async () => {
    browser = await puppeteer.launch(testUtil.getChromeOptions())
    page = await browser.newPage()
    await page.goto(testUtil.extensionRootUrl)
    await homePage.ScrollToEndOfTerms(page)
    await homePage.ClickOnAcceptPrivacy(page)
  })
  afterEach(async () => {
    try {
      console.log('Cleaning up instances')
      await page.close()
      await browser.close()
    } catch (e) {
      console.log('Cannot cleanup instances')
    }
  })

  it('Send BTC to another Wrong address. check Review option has been disabled', async () => {
    const bitCoinName = 'BTC'
    const coinsToSend = '0.000001'

    // Import wallet option
    await homePage.ClickOnImportWallet(page)
    // Enter seed words and submit
    await homePage.EnterSeedWords(page)
    // Create a password & submit
    await passwordPage.SubmitPasswordDetails(page, password)
    // overview page
    await overviewPage.HasOverviewPageLoaded(page)
    await overviewPage.CloseWatsNewModal(page)
    // Select testnet
    await overviewPage.SelectNetwork(page)
    // check Send & Swap & Receive options have been displayed
    await overviewPage.ClickSend(page)
    // Search for coin & select coin
    await searchAssetPage.SearchForAnAsset(page, bitCoinName)

    // Enter send amount (or) coins
    await sendPage.EnterSendAmount(page, coinsToSend)
    // Send address
    await sendPage.EnterSendToAddress(page, '0x172E90C757c66f0d93E96165FDb7B3c03337Be6A')
    // Check Address format error
    await sendPage.ValidateAddressFormatError(page, 'Wrong format. Please check the address.')
    // Check Send Review option has been disabled
    await sendPage.HasReviewButtonDisabled(page)
  })
  it('Send BTC to another address,Lower amount. This exceeds available balance.', async () => {
    const bitCoinName = 'BTC'
    const coinsToSend = '10'

    // Import wallet option
    await homePage.ClickOnImportWallet(page)
    // Enter seed words and submit
    await homePage.EnterSeedWords(page)
    // Create a password & submit
    await passwordPage.SubmitPasswordDetails(page, password)
    // overview page
    await overviewPage.HasOverviewPageLoaded(page)
    await overviewPage.CloseWatsNewModal(page)
    // Select testnet
    await overviewPage.SelectNetwork(page)
    // check Send & Swap & Receive options have been displayed
    await overviewPage.ClickSend(page)
    // Search for coin & select coin
    await searchAssetPage.SearchForAnAsset(page, bitCoinName)

    // Enter send amount (or) coins
    await sendPage.EnterSendAmount(page, coinsToSend)
    // Send address
    await sendPage.EnterSendToAddress(page, '0x32Be343B94f860124dC4fEe278FDCBD38C102D88')
    // Check Send Limit format error
    await sendPage.ValidateAmountLimitError(page, 'Lower amount. This exceeds available balance.')
    // Check Send Review option has been disabled
    await sendPage.HasReviewButtonDisabled(page)
  })
  // In Testnet test are failed with Sender not found error, so skipping this for now
  it.skip('Send SOV to random ETH address', async () => {
    const bitCoinName = 'SOV'
    const coinsToSend = '2'

    // Import wallet option
    await homePage.ClickOnImportWallet(page)
    // Enter seed words and submit
    await homePage.EnterSeedWords(page)
    // Create a password & submit
    await passwordPage.SubmitPasswordDetails(page, password)
    // overview page
    await overviewPage.HasOverviewPageLoaded(page)
    await overviewPage.CloseWatsNewModal(page)
    // Select testnet
    await overviewPage.SelectNetwork(page)
    // Click on bitcoin & Click on Send option
    await overviewPage.SelectChain(page, bitCoinName)
    await page.waitForSelector('#SOV_send_button', { visible: true })
    // Check view explorer
    await overviewPage.HasViewExplorerDisplayed(page, bitCoinName)
    await page.click('#SOV_send_button')
    // Enter send amount (or) coins
    await sendPage.EnterSendAmount(page, coinsToSend)
    // Send address
    const sendToAddress = testDataUtils.getRandomAddress('ethereum')
    await sendPage.EnterSendToAddress(page, sendToAddress)
    // Click Review Button
    await sendPage.ClickSendReview(page)
    // Confirm SEND
    await sendPage.SendConfirmButton(page)
    // Transaction details page validations
    const domain = 'https://explorer.testnet.rsk.co'
    await transactionDetailsPage.ValidateSentAmount(page, '2 SOV')
    await transactionDetailsPage.ValidateSentToLink(page, `${domain}/address`)
    await transactionDetailsPage.ValidateNetworkSpeedFee(page)
    await transactionDetailsPage.ValidateTime(page)
    await transactionDetailsPage.ValidateStatus(page)
    await transactionDetailsPage.ValidateTransactionIDLink(page, `${domain}/tx`)
  })
  it('Send BNB to another BNB wallet', async () => {
    const bitCoinName = 'BNB'
    const coinsToSend = '0.0000001'

    // Import wallet option
    await homePage.ClickOnImportWallet(page)
    // Enter seed words and submit
    await homePage.EnterSeedWords(page)
    // Create a password & submit
    await passwordPage.SubmitPasswordDetails(page, password)
    // overview page
    await overviewPage.HasOverviewPageLoaded(page)
    await overviewPage.CloseWatsNewModal(page)
    // Select testnet
    await overviewPage.SelectNetwork(page)
    await overviewPage.SelectChain(page, bitCoinName)
    await page.waitForSelector('#BNB_send_button', { visible: true })
    await page.click('#BNB_send_button')
    // Enter send amount (or) coins
    await sendPage.EnterSendAmount(page, coinsToSend)
    // Send address
    await sendPage.EnterSendToAddress(page, '0x0c62B13f8116eBA444DeFdE842aBd7d1f68F964f')
    // Click Review Button
    await sendPage.ClickSendReview(page)
    // Confirm SEND
    await sendPage.SendConfirmButton(page)
    // Transaction details page validations
    const domain = 'https://testnet.bscscan.com'
    await transactionDetailsPage.ValidateSentAmount(page, '0 BNB')
    await transactionDetailsPage.ValidateSentToLink(page, `${domain}/address`)
    await transactionDetailsPage.ValidateNetworkSpeedFee(page)
    await transactionDetailsPage.ValidateTime(page)
    await transactionDetailsPage.ValidateStatus(page)
    await transactionDetailsPage.ValidateTransactionIDLink(page, `${domain}/tx`)
  })
  it('Send BTC to another BTC wallet', async () => {
    const bitCoinName = 'BTC'
    const coinsToSend = '0.0000001'

    // Import wallet option
    await homePage.ClickOnImportWallet(page)
    // Enter seed words and submit
    await homePage.EnterSeedWords(page)
    // Create a password & submit
    await passwordPage.SubmitPasswordDetails(page, password)
    // overview page
    await overviewPage.HasOverviewPageLoaded(page)
    await overviewPage.CloseWatsNewModal(page)
    // Select testnet
    await overviewPage.SelectNetwork(page)
    // check Send & Swap & Receive options have been displayed
    await overviewPage.ClickSend(page)
    // Search for coin & select coin
    await searchAssetPage.SearchForAnAsset(page, bitCoinName)

    // Enter send amount (or) coins
    await sendPage.EnterSendAmount(page, coinsToSend)
    // Send address
    const address = testDataUtils.getRandomAddress('bitcoin')
    await sendPage.EnterSendToAddress(page, address)
    // Click Review Button
    await sendPage.ClickSendReview(page)
    // Confirm SEND
    await sendPage.SendConfirmButton(page)
    // Transaction details page validations
    const domain = 'https://blockstream.info/testnet'
    await transactionDetailsPage.ValidateSentAmount(page, '0 BTC')
    await transactionDetailsPage.ValidateSentToLink(page, `${domain}/address`)
    await transactionDetailsPage.ValidateNetworkSpeedFee(page)
    await transactionDetailsPage.ValidateTime(page)
    await transactionDetailsPage.ValidateStatus(page)
    await transactionDetailsPage.ValidateTransactionIDLink(page, `${domain}/tx`)
  })
  it('ETH Send Max value check against Available Balance', async () => {
    const bitCoinName = 'ETH'

    // Import wallet option
    await homePage.ClickOnImportWallet(page)
    // Enter seed words and submit
    await homePage.EnterSeedWords(page)
    // Create a password & submit
    await passwordPage.SubmitPasswordDetails(page, password)
    // overview page
    await overviewPage.HasOverviewPageLoaded(page)
    await overviewPage.CloseWatsNewModal(page)
    // Select testnet
    await overviewPage.SelectNetwork(page)
    // check Send & Swap & Receive options have been displayed
    await overviewPage.ClickSend(page)
    // Search for coin & select coin
    await searchAssetPage.SearchForAnAsset(page, bitCoinName)

    // Click on Max
    await sendPage.SelectMaxSend(page)
    // Validate Available amount vs send amount
    const sendAmount = await sendPage.GetSendAmount(page)
    const availableAmount = await sendPage.GetSendAvailableBalance(page)
    expect(availableAmount,
      'Available balance and Max send amount are equal for ethereum').contains(sendAmount)
  })
  it('ETH Send Check Network Fee', async () => {
    const bitCoinName = 'ETH'

    // Import wallet option
    await homePage.ClickOnImportWallet(page)
    // Enter seed words and submit
    await homePage.EnterSeedWords(page)
    // Create a password & submit
    await passwordPage.SubmitPasswordDetails(page, password)
    // overview page
    await overviewPage.HasOverviewPageLoaded(page)
    await overviewPage.CloseWatsNewModal(page)
    // Select testnet
    await overviewPage.SelectNetwork(page)
    // check Send & Swap & Receive options have been displayed
    await overviewPage.ClickSend(page)
    // Search for coin & select coin
    await searchAssetPage.SearchForAnAsset(page, bitCoinName)

    // Check Network Speed/FEE
    const ethereumNetworkSpeedFee = await sendPage.GetNetworkSpeedFee(page)
    expect(ethereumNetworkSpeedFee, 'ETH Avg Network Speed fee validation')
      .not.equals('(Avg / 0.000000 ETH)')
    // Click on Network Speed/FEE
    await sendPage.ClickNetworkSpeedFee(page)
    await page.hover('#slow', { slow: true })
    await page.screenshot({ path: './screenshots/send_network_speed_fee_slow.png' })
    await page.hover('#fast', { slow: true })
    await page.screenshot({ path: './screenshots/send_network_speed_fee_fast.png' })
  })
  it('NEAR Send Check Network Fee', async () => {
    const bitCoinName = 'NEAR'

    // Import wallet option
    await homePage.ClickOnImportWallet(page)
    // Enter seed words and submit
    await homePage.EnterSeedWords(page)
    // Create a password & submit
    await passwordPage.SubmitPasswordDetails(page, password)
    // overview page
    await overviewPage.HasOverviewPageLoaded(page)
    await overviewPage.CloseWatsNewModal(page)
    // Select testnet
    await overviewPage.SelectNetwork(page)
    // check NEAR
    await overviewPage.SelectChain(page, 'NEAR')
    await page.waitForSelector('#NEAR_send_button', { visible: true })
    await page.waitForSelector('#NEAR_swap_button', { visible: true })
    await page.waitForSelector('#NEAR_receive_button', { visible: true })
    // Check view explorer
    await overviewPage.HasViewExplorerDisplayed(page, bitCoinName)

    const code = await page.$eval('.account-container_balance_code', (el) => el.textContent)
    expect(code).equals(bitCoinName)
    await page.waitForSelector('.account-container_address', { visible: true })
    // Click on NEAR send
    await page.click('#NEAR_send_button')
    await sendPage.EnterSendAmount(page, '1')
    await sendPage.EnterSendToAddress(page, 'caf7949de4fa4a61fd5d4d71c171560e49ad64e35221b01050ddf81a452a61cb')

    // Check Network Speed/FEE
    const ethereumNetworkSpeedFee = await sendPage.GetNetworkSpeedFee(page)
    expect(ethereumNetworkSpeedFee, 'NEAR Avg Network Speed validation')
      .equals('(Avg / 0.001 NEAR)')
    // Click on Network Speed/FEE
    await sendPage.ClickNetworkSpeedFee(page)
    await page.hover('#slow', { slow: true })
    await page.screenshot({ path: './screenshots/send_network_speed_fee_near_slow.png' })
    await page.hover('#fast', { slow: true })
    await page.screenshot({ path: './screenshots/send_network_speed_fee__near_fast.png' })

    // Click on SEND Review button
    await sendPage.ClickSendReview(page)
    const confirmSendValue = await page.$eval('#confirm_send_value', (el) => el.textContent)
    expect(confirmSendValue.trim()).equals('1 NEAR')
    await page.waitForSelector('#detail_group_network_fee', { visible: true })
    await page.waitForSelector('#send_button_confirm:not([enabled]')
    console.log(chalk.green('Send Near button has been enabled'))
  })
})
