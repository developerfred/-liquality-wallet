const TestUtil = require('../utils/TestUtils')
const OverviewPage = require('../Pages/OverviewPage')
const HomePage = require('../Pages/HomePage')
const PasswordPage = require('../Pages/PasswordPage')
const SeedWordsPage = require('../Pages/SeedWordsPage')
const expect = require('chai').expect
const chalk = require('chalk')

const puppeteer = require('puppeteer')

const testUtil = new TestUtil()
const overviewPage = new OverviewPage()
const homePage = new HomePage()
const passwordPage = new PasswordPage()
const seedWordsPage = new SeedWordsPage()

let browser, page
const password = '123123123'

if (process.env.NODE_ENV === 'mainnet') {
  describe('Import wallet - fetch custom token details against ["mainnet"]', async () => {
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
    it('ETHEREUM - [Tether USD]', async () => {
      const tokenDetails = {
        chain: 'ethereum',
        address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        name: 'Tether USD',
        symbol: 'USDT',
        decimal: '6'
      }
      // Import wallet option
      await homePage.ClickOnImportWallet(page)
      // Enter seed words and submit
      await homePage.EnterSeedWords(page, null)
      // Create a password & submit
      await passwordPage.SubmitPasswordDetails(page, password)
      // overview page
      await overviewPage.HasOverviewPageLoaded(page)
      await overviewPage.CloseWatsNewModal(page)
      // Select network(Only works against Mainnet)
      await overviewPage.SelectNetwork(page, 'mainnet')
      // check Send & Swap & Receive options have been displayed
      await overviewPage.ValidateSendSwipeReceiveOptions(page)

      // Click on Backup seed from Burger Icon menu
      await page.waitForSelector('#burger_icon_menu', { visible: true })
      await page.click('#burger_icon_menu')
      console.log(chalk.green('User clicked on Burger Icon Menu'))
      // Click Manage Assets
      await page.waitForSelector('#manage_assets', { visible: true })
      await page.click('#manage_assets')
      console.log(chalk.green('User clicked on Manage Assets'))

      await page.waitForSelector('#add_custom_token', { visible: true })
      await page.click('#add_custom_token')
      console.log(chalk.green('User clicked on Add Custom Token'))
      // Add Custom token screen
      await page.waitForSelector('#contractAddress', { visible: true })
      // select chain
      await page.waitForSelector('#select_chain_dropdown', { visible: true })
      await page.click('#select_chain_dropdown')
      await page.waitForSelector(`#${tokenDetails.chain}_chain`, { visible: true })
      await page.click(`#${tokenDetails.chain}_chain`)
      // paste address
      await page.type('#contractAddress', tokenDetails.address)
      console.log(chalk.green('User enter token address as'), tokenDetails.address)
      await page.click('#tokenSymbol')
      await page.click('#name')
      await page.waitForTimeout(10000)
      // Check Token name
      const name = await page.$eval('#name', el => el.value)
      expect(name).to.equals(tokenDetails.name)
      // Check Token Symbol
      const symbol = await page.$eval('#tokenSymbol', el => el.value)
      expect(symbol).to.equals(tokenDetails.symbol)
      // Check Token Symbol
      const decimal = await page.$eval('#decimals', el => el.value)
      expect(decimal).to.equals(tokenDetails.decimal)
    })
    it('BSC - PancakeSwap token', async () => {
      const tokenDetails = {
        chain: 'bsc',
        address: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
        name: 'PancakeSwap Token',
        symbol: 'Cake',
        decimal: '18'
      }
      // Import wallet option
      await homePage.ClickOnImportWallet(page)
      // Enter seed words and submit
      await homePage.EnterSeedWords(page, null)
      // Create a password & submit
      await passwordPage.SubmitPasswordDetails(page, password)
      // overview page
      await overviewPage.HasOverviewPageLoaded(page)
      await overviewPage.CloseWatsNewModal(page)
      // Select network(Only works against Mainnet)
      await overviewPage.SelectNetwork(page, 'mainnet')
      // check Send & Swap & Receive options have been displayed
      await overviewPage.ValidateSendSwipeReceiveOptions(page)

      // Click on Backup seed from Burger Icon menu
      await page.waitForSelector('#burger_icon_menu', { visible: true })
      await page.click('#burger_icon_menu')
      console.log(chalk.green('User clicked on Burger Icon Menu'))
      // Click Manage Assets
      await page.waitForSelector('#manage_assets', { visible: true })
      await page.click('#manage_assets')
      console.log(chalk.green('User clicked on Manage Assets'))
      // click on add custom token
      await page.waitForSelector('#add_custom_token', { visible: true })
      await page.click('#add_custom_token')
      console.log(chalk.green('User clicked on Add Custom Token'))

      // select chain
      // await page.evaluate( () => document.getElementById("contractAddress").value = "")
      await page.waitForSelector('#select_chain_dropdown', { visible: true })
      await page.click('#select_chain_dropdown')
      await page.waitForSelector(`#${tokenDetails.chain}_chain`, { visible: true })
      await page.click(`#${tokenDetails.chain}_chain`)
      // paste address
      await page.type('#contractAddress', tokenDetails.address)
      console.log(chalk.green('User enter token address as'), tokenDetails.address)
      await page.click('#tokenSymbol')
      await page.click('#name')
      await page.waitForTimeout(10000)
      // Check Token name
      const name = await page.$eval('#name', el => el.value)
      expect(name).to.equals(tokenDetails.name)
      // Check Token Symbol
      const symbol = await page.$eval('#tokenSymbol', el => el.value)
      expect(symbol).to.equals(tokenDetails.symbol)
      // Check Token Symbol
      const decimal = await page.$eval('#decimals', el => el.value)
      expect(decimal).to.equals(tokenDetails.decimal)
    })
    it('Polygon - USD Coin (USDC)', async () => {
      const tokenDetails = {
        chain: 'polygon',
        address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
        name: 'Polygon USD Coin',
        symbol: 'USDC',
        decimal: '6'
      }
      // Import wallet option
      await homePage.ClickOnImportWallet(page)
      // Enter seed words and submit
      await homePage.EnterSeedWords(page, null)
      // Create a password & submit
      await passwordPage.SubmitPasswordDetails(page, password)
      // overview page
      await overviewPage.HasOverviewPageLoaded(page)
      await overviewPage.CloseWatsNewModal(page)
      // Select network(Only works against Mainnet)
      await overviewPage.SelectNetwork(page, 'mainnet')
      // check Send & Swap & Receive options have been displayed
      await overviewPage.ValidateSendSwipeReceiveOptions(page)

      // Click on Backup seed from Burger Icon menu
      await page.waitForSelector('#burger_icon_menu', { visible: true })
      await page.click('#burger_icon_menu')
      console.log(chalk.green('User clicked on Burger Icon Menu'))
      // Click Manage Assets
      await page.waitForSelector('#manage_assets', { visible: true })
      await page.click('#manage_assets')
      console.log(chalk.green('User clicked on Manage Assets'))
      // click on add custom token
      await page.waitForSelector('#add_custom_token', { visible: true })
      await page.click('#add_custom_token')
      console.log(chalk.green('User clicked on Add Custom Token'))

      // select chain
      await page.waitForSelector('#select_chain_dropdown', { visible: true })
      await page.click('#select_chain_dropdown')
      await page.waitForSelector(`#${tokenDetails.chain}_chain`, { visible: true })
      await page.click(`#${tokenDetails.chain}_chain`)
      // paste address
      await page.type('#contractAddress', tokenDetails.address)
      console.log(chalk.green('User enter token address as'), tokenDetails.address)
      await page.click('#tokenSymbol')
      await page.click('#name')
      await page.waitForTimeout(10000)
      // Check Token name
      const name = await page.$eval('#name', el => el.value)
      expect(name).to.equals(tokenDetails.name)
      // Check Token Symbol
      const symbol = await page.$eval('#tokenSymbol', el => el.value)
      expect(symbol).to.equals(tokenDetails.symbol)
      // Check Token Symbol
      const decimal = await page.$eval('#decimals', el => el.value)
      expect(decimal).to.equals(tokenDetails.decimal)
    })
    it('Polygon - Dai Stablecoin (DAI)', async () => {
      const tokenDetails = {
        chain: 'polygon',
        address: '0x84000b263080BC37D1DD73A29D92794A6CF1564e',
        name: 'Dai Stablecoin',
        symbol: 'DAI',
        decimal: '18'
      }
      // Import wallet option
      await homePage.ClickOnImportWallet(page)
      // Enter seed words and submit
      await homePage.EnterSeedWords(page, null)
      // Create a password & submit
      await passwordPage.SubmitPasswordDetails(page, password)
      // overview page
      await overviewPage.HasOverviewPageLoaded(page)
      await overviewPage.CloseWatsNewModal(page)
      // Select network(Only works against Mainnet)
      await overviewPage.SelectNetwork(page, 'mainnet')
      // check Send & Swap & Receive options have been displayed
      await overviewPage.ValidateSendSwipeReceiveOptions(page)

      // Click on Backup seed from Burger Icon menu
      await page.waitForSelector('#burger_icon_menu', { visible: true })
      await page.click('#burger_icon_menu')
      console.log(chalk.green('User clicked on Burger Icon Menu'))
      // Click Manage Assets
      await page.waitForSelector('#manage_assets', { visible: true })
      await page.click('#manage_assets')
      console.log(chalk.green('User clicked on Manage Assets'))
      // click on add custom token
      await page.waitForSelector('#add_custom_token', { visible: true })
      await page.click('#add_custom_token')
      console.log(chalk.green('User clicked on Add Custom Token'))

      // select chain
      await page.waitForSelector('#select_chain_dropdown', { visible: true })
      await page.click('#select_chain_dropdown')
      await page.waitForSelector(`#${tokenDetails.chain}_chain`, { visible: true })
      await page.click(`#${tokenDetails.chain}_chain`)
      // paste address
      await page.type('#contractAddress', tokenDetails.address)
      console.log(chalk.green('User enter token address as'), tokenDetails.address)
      await page.click('#tokenSymbol')
      await page.click('#name')
      await page.waitForTimeout(10000)
      // Check Token name
      const name = await page.$eval('#name', el => el.value)
      expect(name).to.equals(tokenDetails.name)
      // Check Token Symbol
      const symbol = await page.$eval('#tokenSymbol', el => el.value)
      expect(symbol).to.equals(tokenDetails.symbol)
      // Check Token Symbol
      const decimal = await page.$eval('#decimals', el => el.value)
      expect(decimal).to.equals(tokenDetails.decimal)
    })
    it('RSK - Wrapped RBTC', async () => {
      const tokenDetails = {
        chain: 'rsk',
        address: '0x967f8799aF07DF1534d48A95a5C9FEBE92c53ae0',
        name: 'Wrapped RBTC',
        symbol: 'WRBTC',
        decimal: '18'
      }
      // Import wallet option
      await homePage.ClickOnImportWallet(page)
      // Enter seed words and submit
      await homePage.EnterSeedWords(page, null)
      // Create a password & submit
      await passwordPage.SubmitPasswordDetails(page, password)
      // overview page
      await overviewPage.HasOverviewPageLoaded(page)
      await overviewPage.CloseWatsNewModal(page)
      // Select network(Only works against Mainnet)
      await overviewPage.SelectNetwork(page, 'mainnet')
      // check Send & Swap & Receive options have been displayed
      await overviewPage.ValidateSendSwipeReceiveOptions(page)

      // Click on Backup seed from Burger Icon menu
      await page.waitForSelector('#burger_icon_menu', { visible: true })
      await page.click('#burger_icon_menu')
      console.log(chalk.green('User clicked on Burger Icon Menu'))
      // Click Manage Assets
      await page.waitForSelector('#manage_assets', { visible: true })
      await page.click('#manage_assets')
      console.log(chalk.green('User clicked on Manage Assets'))
      // click on add custom token
      await page.waitForSelector('#add_custom_token', { visible: true })
      await page.click('#add_custom_token')
      console.log(chalk.green('User clicked on Add Custom Token'))

      // select chain
      await page.waitForSelector('#select_chain_dropdown', { visible: true })
      await page.click('#select_chain_dropdown')
      await page.waitForSelector(`#${tokenDetails.chain}_chain`, { visible: true })
      await page.click(`#${tokenDetails.chain}_chain`)
      // paste address
      await page.type('#contractAddress', tokenDetails.address)
      console.log(chalk.green('User enter token address as'), tokenDetails.address)
      await page.click('#tokenSymbol')
      await page.click('#name')
      await page.waitForTimeout(10000)
      // Check Token name
      const name = await page.$eval('#name', el => el.value)
      expect(name).to.equals(tokenDetails.name)
      // Check Token Symbol
      const symbol = await page.$eval('#tokenSymbol', el => el.value)
      expect(symbol).to.equals(tokenDetails.symbol)
      // Check Token Symbol
      const decimal = await page.$eval('#decimals', el => el.value)
      expect(decimal).to.equals(tokenDetails.decimal)
    })
    it('Custom token cancel button', async () => {
      const tokenDetails = {
        chain: 'rsk',
        address: '0x967f8799aF07DF1534d48A95a5C9FEBE92c53ae0',
        name: 'Wrapped RBTC',
        symbol: 'WRBTC',
        decimal: '18'
      }
      // Import wallet option
      await homePage.ClickOnImportWallet(page)
      // Enter seed words and submit
      await homePage.EnterSeedWords(page, null)
      // Create a password & submit
      await passwordPage.SubmitPasswordDetails(page, password)
      // overview page
      await overviewPage.HasOverviewPageLoaded(page)
      await overviewPage.CloseWatsNewModal(page)
      // Select network(Only works against Mainnet)
      await overviewPage.SelectNetwork(page, 'mainnet')
      // check Send & Swap & Receive options have been displayed
      await overviewPage.ValidateSendSwipeReceiveOptions(page)

      // Click on Backup seed from Burger Icon menu
      await page.waitForSelector('#burger_icon_menu', { visible: true })
      await page.click('#burger_icon_menu')
      console.log(chalk.green('User clicked on Burger Icon Menu'))
      // Click Manage Assets
      await page.waitForSelector('#manage_assets', { visible: true })
      await page.click('#manage_assets')
      console.log(chalk.green('User clicked on Manage Assets'))
      // click on add custom token
      await page.waitForSelector('#add_custom_token', { visible: true })
      await page.click('#add_custom_token')
      console.log(chalk.green('User clicked on Add Custom Token'))

      // select chain
      await page.waitForSelector('#select_chain_dropdown', { visible: true })
      await page.click('#select_chain_dropdown')
      await page.waitForSelector(`#${tokenDetails.chain}_chain`, { visible: true })
      await page.click(`#${tokenDetails.chain}_chain`)
      // paste address
      await page.type('#contractAddress', tokenDetails.address)
      console.log(chalk.green('User enter token address as'), tokenDetails.address)
      await page.click('#tokenSymbol')
      await page.click('#name')
      await page.waitForTimeout(10000)
      // Check Token name
      const name = await page.$eval('#name', el => el.value)
      expect(name).to.equals(tokenDetails.name)
      // Check Token Symbol
      const symbol = await page.$eval('#tokenSymbol', el => el.value)
      expect(symbol).to.equals(tokenDetails.symbol)
      // Check Token Symbol
      const decimal = await page.$eval('#decimals', el => el.value)
      expect(decimal).to.equals(tokenDetails.decimal)

      // Click on Cancel
      await page.click('#cancel_add_token_button')
      await page.waitForSelector('#add_custom_token', { visible: true })
    })
  })
  describe('Create new wallet - add Custom tokens only against Mainnet', async () => {
    beforeEach(async () => {
      browser = await puppeteer.launch(testUtil.getChromeOptions())
      page = await browser.newPage()
      await page.goto(testUtil.extensionRootUrl)
      await homePage.ScrollToEndOfTerms(page)
      await homePage.ClickOnAcceptPrivacy(page)

      // Create wallet
      await homePage.ClickOnCreateNewWallet(page)
      // Set password & submit details
      await passwordPage.EnterPasswordDetails(page, password, password)
      await passwordPage.SubmitPasswordDetails(page, password)
      // Unlocking wallet...
      const seed1 = (await seedWordsPage.GetBackupSeedWords(page)).seed1
      const seed5 = (await seedWordsPage.GetBackupSeedWords(page)).seed5
      const seed12 = (await seedWordsPage.GetBackupSeedWords(page)).seed12
      // Click Next
      await seedWordsPage.ClickOnWalletNextButton(page)
      // Enter seed1,5,.12
      await seedWordsPage.EnterSeedWords(page, seed1, seed5, seed12)
      // continue
      await seedWordsPage.ClickContinueButton(page)
      // overview page
      await overviewPage.HasOverviewPageLoaded(page)
      await overviewPage.CloseWatsNewModal(page)
      // Select network(Only works against Mainnet)
      await overviewPage.SelectNetwork(page, 'mainnet')
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
    it('ETHEREUM - [Tether USD]', async () => {
      const tokenDetails = {
        chain: 'ethereum',
        address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        name: 'Tether USD',
        symbol: 'USDT',
        decimal: '6'
      }
      // Click on Backup seed from Burger Icon menu
      await page.waitForSelector('#burger_icon_menu', { visible: true })
      await page.click('#burger_icon_menu')
      console.log(chalk.green('User clicked on Burger Icon Menu'))
      // Click Manage Assets
      await page.waitForSelector('#manage_assets', { visible: true })
      await page.click('#manage_assets')
      console.log(chalk.green('User clicked on Manage Assets'))

      await page.waitForSelector('#add_custom_token', { visible: true })
      await page.click('#add_custom_token')
      console.log(chalk.green('User clicked on Add Custom Token'))
      // Add Custom token screen
      await page.waitForSelector('#contractAddress', { visible: true })
      // select chain
      await page.waitForSelector('#select_chain_dropdown', { visible: true })
      await page.click('#select_chain_dropdown')
      await page.waitForSelector(`#${tokenDetails.chain}_chain`, { visible: true })
      await page.click(`#${tokenDetails.chain}_chain`)
      // paste address
      await page.type('#contractAddress', tokenDetails.address)
      console.log(chalk.green('User enter token address as'), tokenDetails.address)
      await page.click('#tokenSymbol')
      await page.click('#name')
      await page.waitForTimeout(10000)
      // Check Token name
      const name = await page.$eval('#name', el => el.value)
      expect(name).to.equals(tokenDetails.name)
      // Check Token Symbol
      const symbol = await page.$eval('#tokenSymbol', el => el.value)
      expect(symbol).to.equals(tokenDetails.symbol)
      // Check Token Symbol
      const decimal = await page.$eval('#decimals', el => el.value)
      expect(decimal).to.equals(tokenDetails.decimal)

      // Click on Add Token button
      await page.click('#add_token_button')

      // Search with token symbol and the token should be enabled with toggled switch
      await page.type('#search_for_an_assert_input', symbol)
      await page.waitForSelector(`#${symbol}`, { visible: true })
      expect(await page.$eval(`#${symbol}_toggle_button > label`, el => el.getAttribute('class')),
        'Added custom token toggled automatically')
        .contains('vue-js-switch toggled')
    })
    it('BSC - PancakeSwap token', async () => {
      const tokenDetails = {
        chain: 'bsc',
        address: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
        name: 'PancakeSwap Token',
        symbol: 'Cake',
        decimal: '18'
      }
      // Click on Backup seed from Burger Icon menu
      await page.waitForSelector('#burger_icon_menu', { visible: true })
      await page.click('#burger_icon_menu')
      console.log(chalk.green('User clicked on Burger Icon Menu'))
      // Click Manage Assets
      await page.waitForSelector('#manage_assets', { visible: true })
      await page.click('#manage_assets')
      console.log(chalk.green('User clicked on Manage Assets'))
      // click on add custom token
      await page.waitForSelector('#add_custom_token', { visible: true })
      await page.click('#add_custom_token')
      console.log(chalk.green('User clicked on Add Custom Token'))

      // select chain
      // await page.evaluate( () => document.getElementById("contractAddress").value = "")
      await page.waitForSelector('#select_chain_dropdown', { visible: true })
      await page.click('#select_chain_dropdown')
      await page.waitForSelector(`#${tokenDetails.chain}_chain`, { visible: true })
      await page.click(`#${tokenDetails.chain}_chain`)
      // paste address
      await page.type('#contractAddress', tokenDetails.address)
      console.log(chalk.green('User enter token address as'), tokenDetails.address)
      await page.click('#tokenSymbol')
      await page.click('#name')
      await page.waitForTimeout(10000)
      // Check Token name
      const name = await page.$eval('#name', el => el.value)
      expect(name).to.equals(tokenDetails.name)
      // Check Token Symbol
      const symbol = await page.$eval('#tokenSymbol', el => el.value)
      expect(symbol).to.equals(tokenDetails.symbol)
      // Check Token Symbol
      const decimal = await page.$eval('#decimals', el => el.value)
      expect(decimal).to.equals(tokenDetails.decimal)

      // Click on Add Token button
      await page.click('#add_token_button')

      // Search with token symbol and the token should be enabled with toggled switch
      await page.type('#search_for_an_assert_input', symbol)
      await page.waitForSelector(`#${symbol}`, { visible: true })
      expect(await page.$eval(`#${symbol}_toggle_button > label`, el => el.getAttribute('class')),
        'Added custom token toggled automatically')
        .contains('vue-js-switch toggled')
    })
    it('Polygon - USD Coin (USDC)', async () => {
      const tokenDetails = {
        chain: 'polygon',
        address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
        name: 'Polygon USD Coin',
        symbol: 'USDC',
        decimal: '6'
      }
      // Click on Backup seed from Burger Icon menu
      await page.waitForSelector('#burger_icon_menu', { visible: true })
      await page.click('#burger_icon_menu')
      console.log(chalk.green('User clicked on Burger Icon Menu'))
      // Click Manage Assets
      await page.waitForSelector('#manage_assets', { visible: true })
      await page.click('#manage_assets')
      console.log(chalk.green('User clicked on Manage Assets'))
      // click on add custom token
      await page.waitForSelector('#add_custom_token', { visible: true })
      await page.click('#add_custom_token')
      console.log(chalk.green('User clicked on Add Custom Token'))

      // select chain
      await page.waitForSelector('#select_chain_dropdown', { visible: true })
      await page.click('#select_chain_dropdown')
      await page.waitForSelector(`#${tokenDetails.chain}_chain`, { visible: true })
      await page.click(`#${tokenDetails.chain}_chain`)
      // paste address
      await page.type('#contractAddress', tokenDetails.address)
      console.log(chalk.green('User enter token address as'), tokenDetails.address)
      await page.click('#tokenSymbol')
      await page.click('#name')
      await page.waitForTimeout(10000)
      // Check Token name
      const name = await page.$eval('#name', el => el.value)
      expect(name).to.equals(tokenDetails.name)
      // Check Token Symbol
      const symbol = await page.$eval('#tokenSymbol', el => el.value)
      expect(symbol).to.equals(tokenDetails.symbol)
      // Check Token Symbol
      const decimal = await page.$eval('#decimals', el => el.value)
      expect(decimal).to.equals(tokenDetails.decimal)

      // Click on Add Token button
      await page.click('#add_token_button')

      // Search with token symbol and the token should be enabled with toggled switch
      await page.type('#search_for_an_assert_input', symbol)
      await page.waitForSelector(`#${symbol}`, { visible: true })
      expect(await page.$eval(`#${symbol}_toggle_button > label`, el => el.getAttribute('class')),
        'Added custom token toggled automatically')
        .contains('vue-js-switch toggled')
    })
    it('RSK - Wrapped RBTC', async () => {
      const tokenDetails = {
        chain: 'rsk',
        address: '0x967f8799aF07DF1534d48A95a5C9FEBE92c53ae0',
        name: 'Wrapped RBTC',
        symbol: 'WRBTC',
        decimal: '18'
      }
      // Click on Backup seed from Burger Icon menu
      await page.waitForSelector('#burger_icon_menu', { visible: true })
      await page.click('#burger_icon_menu')
      console.log(chalk.green('User clicked on Burger Icon Menu'))
      // Click Manage Assets
      await page.waitForSelector('#manage_assets', { visible: true })
      await page.click('#manage_assets')
      console.log(chalk.green('User clicked on Manage Assets'))
      // click on add custom token
      await page.waitForSelector('#add_custom_token', { visible: true })
      await page.click('#add_custom_token')
      console.log(chalk.green('User clicked on Add Custom Token'))

      // select chain
      await page.waitForSelector('#select_chain_dropdown', { visible: true })
      await page.click('#select_chain_dropdown')
      await page.waitForSelector(`#${tokenDetails.chain}_chain`, { visible: true })
      await page.click(`#${tokenDetails.chain}_chain`)
      // paste address
      await page.type('#contractAddress', tokenDetails.address)
      console.log(chalk.green('User enter token address as'), tokenDetails.address)
      await page.click('#tokenSymbol')
      await page.click('#name')
      await page.waitForTimeout(10000)
      // Check Token name
      const name = await page.$eval('#name', el => el.value)
      expect(name).to.equals(tokenDetails.name)
      // Check Token Symbol
      const symbol = await page.$eval('#tokenSymbol', el => el.value)
      expect(symbol).to.equals(tokenDetails.symbol)
      // Check Token Symbol
      const decimal = await page.$eval('#decimals', el => el.value)
      expect(decimal).to.equals(tokenDetails.decimal)

      // Click on Add Token button
      await page.click('#add_token_button')

      // Search with token symbol and the token should be enabled with toggled switch
      await page.type('#search_for_an_assert_input', symbol)
      await page.waitForSelector(`#${symbol}`, { visible: true })
      expect(await page.$eval(`#${symbol}_toggle_button > label`, el => el.getAttribute('class')),
        'Added custom token toggled automatically')
        .contains('vue-js-switch toggled')
    })
    it('RSK - rBUND', async () => {
      const tokenDetails = {
        chain: 'rsk',
        address: '0x4991516DF6053121121274397A8C1DAD608bc95B',
        name: 'rBUND',
        symbol: 'rBUND',
        decimal: '18'
      }
      // Click on Backup seed from Burger Icon menu
      await page.waitForSelector('#burger_icon_menu', { visible: true })
      await page.click('#burger_icon_menu')
      console.log(chalk.green('User clicked on Burger Icon Menu'))
      // Click Manage Assets
      await page.waitForSelector('#manage_assets', { visible: true })
      await page.click('#manage_assets')
      console.log(chalk.green('User clicked on Manage Assets'))
      // click on add custom token
      await page.waitForSelector('#add_custom_token', { visible: true })
      await page.click('#add_custom_token')
      console.log(chalk.green('User clicked on Add Custom Token'))

      // select chain
      await page.waitForSelector('#select_chain_dropdown', { visible: true })
      await page.click('#select_chain_dropdown')
      await page.waitForSelector(`#${tokenDetails.chain}_chain`, { visible: true })
      await page.click(`#${tokenDetails.chain}_chain`)
      // paste address
      await page.type('#contractAddress', tokenDetails.address)
      console.log(chalk.green('User enter token address as'), tokenDetails.address)
      await page.click('#tokenSymbol')
      await page.click('#name')
      await page.waitForTimeout(10000)
      // Check Token name
      const name = await page.$eval('#name', el => el.value)
      expect(name).to.equals(tokenDetails.name)
      // Check Token Symbol
      const symbol = await page.$eval('#tokenSymbol', el => el.value)
      expect(symbol).to.equals(tokenDetails.symbol)
      // Check Token Symbol
      const decimal = await page.$eval('#decimals', el => el.value)
      expect(decimal).to.equals(tokenDetails.decimal)

      // Click on Add Token button
      await page.click('#add_token_button')

      // Search with token symbol and the token should be enabled with toggled switch
      await page.type('#search_for_an_assert_input', symbol)
      await page.waitForSelector(`#${symbol}`, { visible: true })
      expect(await page.$eval(`#${symbol}_toggle_button > label`, el => el.getAttribute('class')),
        'Added custom token toggled automatically')
        .contains('vue-js-switch toggled')
    })
  })
}
