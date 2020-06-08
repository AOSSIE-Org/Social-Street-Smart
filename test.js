const puppeteer = require('puppeteer');
var assert = require('assert');
const extensionPath = './lib'
let browser = null;
let testingPage = null;
let optionsPage = null;
let optionsUrl = "chrome-extension://kgofljnbemgcgneaigebncpcmancipeg/views/settings.html";
let className = "";


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

    // className = ["CB_twitter", "CB_reddit"];
    className = "CB_twitter";
    optionsTest()

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

    className = "CB_twitter";
    optionsTest()

    // describe ('Options' , async function(){
    //     it('IDK', async function(){
    //         await SSSoptions();
    //         await optionsPage.close()
    //     })
    // });

    
    // describe('Second test', async function(){
    //     it('IDK', async function(){
    //         let newUrl = "https://www.reddit.com/r/Guitar/comments/gypr3e/play_burnin_for_you_blue_%C3%B6yster_cult_all_guitars/"
    //         await testingPage.goto(newUrl)
    //         const subName = await testingPage.$eval('._19bCWnxeTjqzBElWZfIlJb', el => el.textContent)
    //         console.log(subName)
    //         assert.equal(subName,'r/Guitar')
    //     })


    // });

    // describe ('Options' , async function(){
    //     it('IDK', async function(){
    //         await SSSoptions();
    //     })
    // });

    // optionsTest()

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

    // optionsPage = await browser.newPage();
    testingPage = await browser.newPage();
    // await page.waitFor(7000);
    // await optionsPage.goto("chrome-extension://kgofljnbemgcgneaigebncpcmancipeg/views/settings.html")

    // const url = 'https://www.reddit.com/r/testingground4bots/comments/fagpst/you_wont_believe_what_happened_next/'
    // await testingPage.goto(url)
}


// Opens the options page for SSS
async function SSSoptions(){

    optionsPage = await browser.newPage();
    // await page.waitFor(7000);
    await optionsPage.goto("chrome-extension://kgofljnbemgcgneaigebncpcmancipeg/views/settings.html")
    // className.forEach( (opt) => {
    //     const toggle = await optionsPage.$('.' + opt, el => el.outerHTML);
    // // await page.waitFor(3000);
    //     await toggle.click();
    // })
    const toggle = await optionsPage.$('.' + className, el => el.outerHTML);
    // await page.waitFor(3000);
    await toggle.click();
    const saveSettings = await optionsPage.$('#save_settings', el => el.outerHTML);
    await saveSettings.click();
    // await page.waitFor(5000);

}

async function optionsTest(){
    describe ('Options' , async function(){
        it('IDK', async function(){
            await SSSoptions();
        })
    });
}