const puppeteer = require('puppeteer');
const scrollPageToBottom = require('puppeteer-autoscroll-down')
const fetch = require("node-fetch");
var assert = require('assert');
const extensionPath = './lib'
let browser = null;
let testingPage = null;
let optionsPage = null;

// let optionsUrl = "chrome-extension://kgofljnbemgcgneaigebncpcmancipeg/views/settings.html";
let className = "CB_twitter";
let extensionID = "";

// This script uses long wait times due to the APIs being hosted on AWS Lambda.
// If the functions haven't been invoked in a long duration, their state becomes "cold"
// A fresh invoke then takes a long time to warm the funtion up for the first time

describe('Extension Test', function(){
    
    this.timeout(100000);
    before(async function(){
        await boot();
    });
    warmUpCB();
    warmUpHS();
    // twittercb();
    // twitterhs();
    redditcb();
    reddiths();
    facebookcb();
    
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

async function warmUpCB(){
    describe ('Warming Up the Clickbait API' , async function(){
        it('Checking if the API is live...', async function(){
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
              };
              
              fetch("https://17u8uun009.execute-api.us-east-1.amazonaws.com/dev/pred?text=hi", requestOptions)
                .then(response => response.text())
                .then(result => console.log())
                .catch(error => console.log('error', error));
        })
    });
};

async function warmUpHS(){
    describe ('Warming Up the Hatespeech API' , async function(){
        it('Checking if the API is live...', async function(){
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
              };
              
              fetch("https://wpxmafpmjf.execute-api.us-east-1.amazonaws.com/dev/pred?text=hi", requestOptions)
                .then(response => response.text())
                .then(result => console.log())
                .catch(error => console.log('error', error));
        })
    });
};



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
            await optionsPage.waitFor(5000)
            await saveSettings.click();

            // Test feature
            let newUrl = "https://twitter.com/BuzzFeed/status/1269750893009870848"
            // let newUrl = "https://twitter.com/BuzzFeed"
            // await testingPage.waitFor(5000)
            await testingPage.goto(newUrl)
            const lastPosition = await scrollPageToBottom(testingPage)
            await testingPage.waitFor(10000);

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
            await optionsPage.waitFor(5000)
            await saveSettings.click();

        })
    });
};


async function twitterhs(){
    describe ('Twitter HS' , async function(){
        it('Testing...', async function(){
            className = "HS_twitter";
            // Enable feature in extension settings
            optionsPage = await browser.newPage();
            await optionsPage.goto("chrome-extension://"+ extensionID +"/views/settings.html")
            let toggle = await optionsPage.$('.' + className, el => el.outerHTML);
            await toggle.click();
            let saveSettings = await optionsPage.$('#save_settings', el => el.outerHTML);
            await optionsPage.waitFor(5000)
            await saveSettings.click();

            // Test feature
            let newUrl = "https://twitter.com/search?q=fuck%20&src=typed_query"
            // await testingPage.waitFor(5000)
            await testingPage.goto(newUrl)
            await testingPage.waitFor(10000);

            const CB = await testingPage.$eval('.SSS', el => el.textContent)
            let t = CB.includes("TOXIC")
            assert.equal(t, true);

            // Disable feature in extension settings
            optionsPage = await browser.newPage();
            await optionsPage.goto("chrome-extension://"+ extensionID +"/views/settings.html")
            toggle = await optionsPage.$('.' + className, el => el.outerHTML);
            await toggle.click();
            saveSettings = await optionsPage.$('#save_settings', el => el.outerHTML);
            await optionsPage.waitFor(5000)
            await saveSettings.click();

        })
    });
};

async function redditcb(){
    describe ('Reddit CB' , async function(){
        it('Testing...', async function(){
            className = "CB_reddit";
            // Enable feature in extension settings
            optionsPage = await browser.newPage();
            await optionsPage.goto("chrome-extension://"+ extensionID +"/views/settings.html")
            let toggle = await optionsPage.$('.' + className, el => el.outerHTML);
            await toggle.click();
            let saveSettings = await optionsPage.$('#save_settings', el => el.outerHTML);
            await optionsPage.waitFor(5000)
            await saveSettings.click();

            // Test feature
            let newUrl = "https://www.reddit.com/r/buzzfeed/top/?t=all"
            // await testingPage.waitFor(5000)
            await testingPage.goto(newUrl)
            await testingPage.waitFor(10000);

            const CB = await testingPage.$eval('.SSS', el => el.textContent)
            let t = CB.includes("Clickbait")
            assert.equal(t, true);

            // Disable feature in extension settings
            optionsPage = await browser.newPage();
            await optionsPage.goto("chrome-extension://"+ extensionID +"/views/settings.html")
            toggle = await optionsPage.$('.' + className, el => el.outerHTML);
            await toggle.click();
            saveSettings = await optionsPage.$('#save_settings', el => el.outerHTML);
            await optionsPage.waitFor(5000)
            await saveSettings.click();

        })
    });
};

async function reddiths(){
    describe ('Reddit HS' , async function(){
        it('Testing...', async function(){
            className = "HS_reddit";
            // Enable feature in extension settings
            optionsPage = await browser.newPage();
            await optionsPage.goto("chrome-extension://"+ extensionID +"/views/settings.html")
            let toggle = await optionsPage.$('.' + className, el => el.outerHTML);
            await toggle.click();
            let saveSettings = await optionsPage.$('#save_settings', el => el.outerHTML);
            await optionsPage.waitFor(5000)
            await saveSettings.click();

            // Test feature
            let newUrl = "https://www.reddit.com/search/?q=fuck"
            // await testingPage.waitFor(5000)
            await testingPage.goto(newUrl)
            const lastPosition = await scrollPageToBottom(testingPage)
            await testingPage.waitFor(10000);

            const CB = await testingPage.$eval('.SSS', el => el.textContent)
            let t = CB.includes("TOXIC")
            assert.equal(t, true);

            // Disable feature in extension settings
            optionsPage = await browser.newPage();
            await optionsPage.goto("chrome-extension://"+ extensionID +"/views/settings.html")
            toggle = await optionsPage.$('.' + className, el => el.outerHTML);
            await toggle.click();
            saveSettings = await optionsPage.$('#save_settings', el => el.outerHTML);
            await optionsPage.waitFor(5000)
            await saveSettings.click();

        })
    });
};


async function facebookcb(){
    describe ('Facebook CB' , async function(){
        it('Testing...', async function(){
            className = "CB_facebook";
            // Enable feature in extension settings
            optionsPage = await browser.newPage();
            await optionsPage.goto("chrome-extension://"+ extensionID +"/views/settings.html")
            let toggle = await optionsPage.$('.' + className, el => el.outerHTML);
            await toggle.click();
            let saveSettings = await optionsPage.$('#save_settings', el => el.outerHTML);
            await optionsPage.waitFor(5000)
            await saveSettings.click();

            // Test feature
            let newUrl = "https://www.facebook.com/BuzzFeed/"
            // await testingPage.waitFor(5000)
            await testingPage.goto(newUrl)
            const lastPosition = await scrollPageToBottom(testingPage)
            await testingPage.waitFor(10000);

            const CB = await testingPage.$eval('.SSS', el => el.textContent)
            let t = CB.includes("Clickbait")
            assert.equal(t, true);

            // Disable feature in extension settings
            optionsPage = await browser.newPage();
            await optionsPage.goto("chrome-extension://"+ extensionID +"/views/settings.html")
            toggle = await optionsPage.$('.' + className, el => el.outerHTML);
            await toggle.click();
            saveSettings = await optionsPage.$('#save_settings', el => el.outerHTML);
            await optionsPage.waitFor(5000)
            await saveSettings.click();

        })
    });
};
