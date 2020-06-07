const puppeteer = require('puppeteer');
var assert = require('assert');
const extensionPath = './lib'
let browser = null;
let extensionPage = null;

// test("reddit", async () => {
//     const url = 'https://www.reddit.com/r/testingground4bots/comments/fagpst/you_wont_believe_what_happened_next/'
//     const page = await browser.newPage();
//     await page.goto(url, {waitUntil: 'load', timeout: 0});
//     expect(5).toBeGreaterThan(0);
//     page.close()
// }, 70000);

describe('Extension Test', function(){
    this.timeout(100000);
    before(async function() {
        await boot();
    });

    describe('First test', async function(){
        it('IDK', async function(){

            const subName = await extensionPage.$eval('._19bCWnxeTjqzBElWZfIlJb', el => el.textContent)
            console.log(subName)
            assert.equal(subName,'r/testingground4bots')
            // assert.equal(1, 1);
        })
    });

    after(async function(){
        await browser.close()
    });

})

async function boot() {
    browser = await puppeteer.launch({
      headless: false, // extension are allowed only in head-full mode
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`
      ]
    });

    const page = await browser.newPage();
    await page.waitFor(7000);

    const url = 'https://www.reddit.com/r/testingground4bots/comments/fagpst/you_wont_believe_what_happened_next/'
    extensionPage = await browser.newPage();
    await extensionPage.goto(url)
}
