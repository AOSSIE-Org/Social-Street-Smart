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
    optionsTest()
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

    const dummyPage = await browser.newPage();
    // await dummyPage.waitFor(10000); // arbitrary wait time.
  
    const targets = await browser.targets();
    const extensionTarget = targets.find(({ _targetInfo }) => {
      return _targetInfo.title === 'Social Street Smart';
    });
  
    const extensionUrl = extensionTarget._targetInfo.url || '';
    [,, extensionID] = extensionUrl.split('/');
    dummyPage.close()
    // optionsPage = await browser.newPage();
    // await optionsPage.goto("chrome-extension://"+ extensionID +"/views/settings.html")
    // const toggle = await optionsPage.$('.' + className, el => el.outerHTML);
    // await toggle.click();
    // const saveSettings = await optionsPage.$('#save_settings', el => el.outerHTML);
    // await optionsPage.waitFor(5000)
    // await saveSettings.click();


}


// Opens the options page for SSS
// async function SSSoptions(){

//     optionsPage = await browser.newPage();
//     await optionsPage.goto("chrome-extension://"+ extensionID +"/views/settings.html")
//     const toggle = await optionsPage.$('.' + className, el => el.outerHTML);
//     await toggle.click();
//     const saveSettings = await optionsPage.$('#save_settings', el => el.outerHTML);
//     await saveSettings.click();

// }

async function optionsTest(){
    describe ('Options' , async function(){
        it('IDK', async function(){
            // await SSSoptions();
            optionsPage = await browser.newPage();
            await optionsPage.goto("chrome-extension://"+ extensionID +"/views/settings.html")
            const toggle = await optionsPage.$('.' + className, el => el.outerHTML);
            await toggle.click();
            const saveSettings = await optionsPage.$('#save_settings', el => el.outerHTML);
            await optionsPage.waitFor(2000)
            await saveSettings.click();

            let newUrl = "https://twitter.com/BuzzFeed/status/1269750893009870848"
            // await testingPage.waitFor(2000)
            await testingPage.goto(newUrl)
            await testingPage.waitFor(3000);

            const CB = await testingPage.$eval('.SSS', el => el.textContent)
            console.log(CB)
            let t = CB.includes("Clickbait")
            assert.equal(t, true);

        })
    });

    // test1()
}

async function test1(){
    describe('First test', async function(){
        it('IDK', async function(){
            // let newUrl = "https://www.reddit.com/r/testingground4bots/comments/fagpst/you_wont_believe_what_happened_next/"
            let newUrl = "https://twitter.com/BuzzFeed/status/1269750893009870848"
            // await testingPage.waitFor(2000)
            await testingPage.goto(newUrl)
            await testingPage.waitFor(3000);

            const CB = await testingPage.$eval('.SSS', el => el.textContent)
            console.log(CB)
            // let t = true;
            let t = CB.includes("Clickbait")
            // assert.equal(CB, "Clickbait")
            assert.equal(t, true);
        })
    });

    return true;
}