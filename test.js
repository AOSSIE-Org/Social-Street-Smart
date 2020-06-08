const puppeteer = require('puppeteer');
var assert = require('assert');
const extensionPath = './lib'
let browser = null;
let testingPage = null;
let optionsPage = null;
// let optionsUrl = "chrome-extension://kgofljnbemgcgneaigebncpcmancipeg/views/settings.html";
let className = "CB_twitter";
let extensionID = "";

describe('Extension Test', function(){
    
    this.timeout(100000);
    before(async function() {
        await boot();
    });

    // className = ["CB_twitter", "CB_reddit"];
    // className = "CB_twitter";
    twittercb()
    // test1();
    // test1();



    after(async function(){
        await browser.close()
    });

})

// Initialised the browser instance
async function boot() {
    browser = await puppeteer.launch({
      headless: false, // extension are allowed only in head-full mode
      args: [
         `--no-sandbox`,
         `--allow-running-insecure-content`,
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`
      ]
    });

    // Define the Chorome tabs/pages

    testingPage = await browser.newPage();

    // Get extensionID
    const dummyPage = await browser.newPage();
    const targets = await browser.targets();
    const extensionTarget = targets.find(({ _targetInfo }) => {
        return _targetInfo.title === 'Social Street Smart';
    });
    const extensionUrl = extensionTarget._targetInfo.url || '';
    [,, extensionID] = extensionUrl.split('/');
    dummyPage.close()
    


}

async function twittercb(){
    describe ('Twitter CB' , async function(){
        it('Testing...', async function(){
            className = "CB_twitter";
            // Enable feature in extension settings
            optionsPage = await browser.newPage();
            await optionsPage.goto("chrome-extension://"+ extensionID +"/views/settings.html")
            let toggle = await optionsPage.$('.' + className, el => el.outerHTML);
            await toggle.click();
            let saveSettings = await optionsPage.$('#save_settings', el => el.outerHTML);
            await optionsPage.waitFor(2000)
            await saveSettings.click();

            // Test feature
            let newUrl = "https://twitter.com/BuzzFeed/status/1269750893009870848"
            // await testingPage.waitFor(2000)
            await testingPage.goto(newUrl)
            await testingPage.waitFor(3000);

            const CB = await testingPage.$eval('.SSS', el => el.textContent)
            // console.log(CB)
            let t = CB.includes("Clickbait")
            assert.equal(t, true);

            // Disable feature in extension settings
            optionsPage = await browser.newPage();
            await optionsPage.goto("chrome-extension://"+ extensionID +"/views/settings.html")
            toggle = await optionsPage.$('.' + className, el => el.outerHTML);
            await toggle.click();
            saveSettings = await optionsPage.$('#save_settings', el => el.outerHTML);
            await optionsPage.waitFor(2000)
            await saveSettings.click();

        })
    });
};

