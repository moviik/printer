const puppeteer = require('puppeteer')

let browser

puppeteer.launch({ executablePath: 'chromium-browser' }).then((result) => {
  browser = result
})

module.exports = () => {
  if (browser) {
    return browser
  }

  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (browser) {
        clearInterval(interval)
        resolve(browser)
      }
    }, 100)
  })
}
