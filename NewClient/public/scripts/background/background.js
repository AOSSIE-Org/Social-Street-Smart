import { CONFIG } from './config.js';

var r = /:\/\/(.[^/]+)/;
var prevWebsite = '';
var myURL = 'about:blank';

var msgs = '';
console.log('start');

async function fetchNewsWebsites() {
  try {
    const URL = chrome.runtime.getURL('common/news_websites.json');
    const response = await fetch(URL);
    if (response.ok) {
      msgs = await response.json();
      console.log(msgs);
    } else {
      console.error('Failed to fetch JSON:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error fetching JSON:', error);
  }
}

fetchNewsWebsites();

var websites = msgs.Website;
var domainsList = msgs.Domain;
var comments = msgs.Comments;

let creds, newsKeys;

chrome.storage.sync.get('diiKeys', function (result) {
  console.log('Old Keys:', result);
  creds = result.diiKeys;
});

chrome.storage.sync.get('newsKeys', function (result) {
  console.log('Old Keys:', result);
  newsKeys = result.newsKeys;
});

// Context menu creation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'CheckShcMenu',
    title: 'Check Url Safety',
    contexts: ['link', 'selection'],
  });
  
  chrome.contextMenus.create({
    id: 'CheckSslMenu',
    title: 'Check SSL Validity',
    contexts: ['link', 'selection'],
  });

  chrome.contextMenus.create({
    id: 'reportFNMenu',
    title: 'Report For Fake News',
    contexts: ['link', 'selection'],
  });
  
  chrome.contextMenus.create({
    id: 'reportHSMenu',
    title: 'Report For Hate Speech',
    contexts: ['link', 'selection'],
  });

  chrome.contextMenus.create({
    id: 'summarizar',
    title: 'Summarize text or link',
    contexts: ['link', 'selection'],
  });

  chrome.contextMenus.create({
    id: 'SsSorigin',
    title: 'Get probable News',
    contexts: ['selection'],
  });

  chrome.contextMenus.create({
    id: 'diiMenu',
    title: 'Check image for disinformation',
    contexts: ['image'],
  });

  chrome.contextMenus.create({
    id: 'fnMenu',
    title: 'Check for Fake News',
    contexts: ['selection', 'link'],
  });

  chrome.contextMenus.create({
    id: 'fcMenu',
    title: 'Check for Fact Checker',
    contexts: ['link', 'selection'],
  });
});

// Context menu click handler
chrome.contextMenus.onClicked.addListener((clickData, tab) => {
  switch (clickData.menuItemId) {
    case 'CheckShcMenu':
      handleCheckShc(clickData);
      break;
    case 'CheckSslMenu':
      handleCheckSsl(clickData);
      break;
    case 'summarizar':
      handleSummarizar(clickData);
      break;
    case 'reportFNMenu':
    case 'reportHSMenu':
      saveToLocalAndDB(clickData.menuItemId, clickData);
      break;
    case 'SsSorigin':
      handleSsSorigin(clickData);
      break;
    case 'diiMenu':
      handleDii(clickData);
      break;
    case 'fnMenu':
      handleFakeNews(clickData);
      break;
    case 'fcMenu':
      handleFactChecker(clickData);
      break;
  }
});

function handleCheckShc(clickData) {
  let targetUrl = clickData.linkUrl || clickData.selectionText;
  fetch(`${CONFIG.SHC_API_URL}?url=${encodeURIComponent(targetUrl)}`)
    .then(response => response.json())
    .then(result => {
      chrome.windows.create({
        url: `scripts/content/shc/shcResult.html?api=shc&score=${btoa(result.Score)}&valid=${btoa(result.isValid)}&target=${btoa(result.url)}`,
        focused: true,
        type: 'popup'
      });
    })
    .catch(error => console.log('error', error));
}

function handleCheckSsl(clickData) {
  let targetUrl = clickData.linkUrl || clickData.selectionText;
  fetch(`${CONFIG.SSL_API_URL}?url=${encodeURIComponent(targetUrl)}`)
    .then(response => response.json())
    .then(result => {
      chrome.windows.create({
        url: `scripts/content/shc/shcResult.html?api=ssl&safe=${btoa(result.isSafe)}&valid=${btoa(result.isValid)}&target=${btoa(result.url)}`,
        focused: true,
        type: 'popup'
      });
    })
    .catch(error => console.log('error', error));
}

function handleSummarizar(clickData) {
  let targetUrl = clickData.selectionText;
  fetch(`${CONFIG.SUMMARIZE_API_URL}?text=${encodeURIComponent(targetUrl)}`)
    .then(response => response.json())
    .then(data => {
      let resultText = data.Result;
      chrome.windows.create({
        url: `scripts/content/summarizar/summarizar.html?summary=${encodeURIComponent(resultText)}`,
        focused: true,
        type: 'popup'
      });
    })
    .catch(error => console.error('Error fetching the summary:', error));
}

let currentDomain = '';
let startTime = Date.now();

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  updateTimeForDomain(tab.url);
});

chrome.tabs.onUpdated.addListener((_, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    updateTimeForDomain(tab.url);
  }
});

function updateTimeForDomain(url) {
  if (!url) return;
  const now = Date.now();
  const domain = new URL(url).hostname;
  
  if (currentDomain) {
    const timeSpent = now - startTime;
    chrome.storage.local.get(currentDomain, (result) => {
      const currentTime = result[currentDomain] || 0;
      chrome.storage.local.set({ [currentDomain]: currentTime + timeSpent });
    });
  }
  currentDomain = domain;
  startTime = now;
}


async function saveToLocalAndDB(menuItemId, clickData) {
  const isFakeNews = menuItemId === 'reportFNMenu';
  const apiUrl = isFakeNews ? CONFIG.FAKE_NEWS_API_URL : CONFIG.HATE_SPEECH_API_URL;

  try {
    const requestOptions = buildRequestOptions(clickData, isFakeNews);
    const response = await fetch(apiUrl, requestOptions);

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data['text']) {
      throw new Error('Response data does not contain text');
    }

    let result = await chrome.storage.sync.get('reported_contents');
    result = initializeStorageIfEmpty(result);

    const contentKey = isFakeNews ? 'reported_fake_news' : 'reported_hate_speech';
    result['reported_contents'][contentKey][data['text']] = null;

    await chrome.storage.sync.set(result);

    showNotification('Reported Successfully', 'Thanks for your feedback!!');
  } catch (error) {
    console.error(`Error reporting ${isFakeNews ? 'fake news' : 'hate speech'}:`, error);
  }
}

function buildRequestOptions(clickData, isFakeNews) {
  const isText = clickData.selectionText && !isUrl(clickData.selectionText);

  if (isText) {
    return {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: clickData.selectionText })
    };
  }

  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ link: clickData.selectionText || clickData.linkUrl })
  };
}

function isUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function initializeStorageIfEmpty(result) {
  if (Object.keys(result).length === 0) {
    return {
      'reported_contents': {
        'reported_fake_news': {},
        'reported_hate_speech': {}
      }
    };
  }
  return result;
}

function showNotification(title, message) {
  chrome.notifications.create({
    type: 'basic',
    title,
    message,
    iconUrl: '../../assets/icon/72.png'
  });
}

function handleSsSorigin(clickData) {
  if (clickData.selectionText) {
    fetch(`${CONFIG.NEWS_API_URL}?text=${clickData.selectionText}&key=${newsKeys}`)
      .then(response => response.json())
      .then(data => {
        const notific = {
          type: 'basic',
          title: 'Origin probabilities: ',
          message: `High: ${data.HIGH}, SOME: ${data.SOME}`,
          iconUrl: '../../assets/icon/72.png'
        };
        chrome.notifications.create(notific);
      })
      .catch(error => console.error('Error:', error));
  }
}

function handleDii(clickData) {
  const imgSrc = clickData.srcUrl;
  fetch(`${CONFIG.DII_API_URL}?creds=${creds}&link=${imgSrc}`)
    .then(response => response.text())
    .then(result => {
      chrome.windows.create({
        url: `scripts/content/dii/diiResult.html?api=dii&imgsrc=${btoa(imgSrc)}&result=${btoa(result)}`,
        focused: true,
        type: 'popup'
      });
    })
    .catch(error => console.log('error', error));
}

function handleFakeNews(clickData) {
  let text = clickData.selectionText;
  if (text) {
    checkFakeNews(text);
  } else {
    fetch(CONFIG.GET_TEXT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ link: clickData.linkUrl })
    })
      .then(response => response.json())
      .then(result => {
        checkFakeNews(result.searchText);
      });
  }
}

function checkFakeNews(query) {
  let searchKeyWords = getSearchKeywords(query);
  getQueryResults(searchKeyWords).then(data => {
    fetch(CONFIG.FAKE_NEWS_PREDICT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query, relatedArticles: Array.from(data) })
    })
      .then(response => response.text())
      .then(result => {
        chrome.windows.create({
          url: `scripts/content/dii/fnResult.html?api=fn&src=${btoa(unescape(encodeURIComponent(query)))}&result=${btoa(unescape(encodeURIComponent(result)))}`,
          focused: true,
          type: 'popup'
        });
      })
      .catch(error => console.error('error', error));
  });
}

function getSearchKeywords(query){

    const results = new Set();
  
    results.add(query); // search for the whole text
  
    let docx = nlp(query);
    let sentences = docx.sentences().data();
  
  
    for(let i = 0;i< sentences.length;i++){
      let sent = sentences[i].text;
      results.add(sent);
  
      let tempDocx = nlp(sent);
  
      let nounsCombined = tempDocx.nouns().text();
      let adjectivesCombined = tempDocx.adjectives().text();
      let verbsCombined = tempDocx.verbs().text() ;
  
      let newQuery = nounsCombined;
      if (adjectivesCombined){
        newQuery += (' OR ' +  nounsCombined + ' '  + adjectivesCombined);
      }
      if (verbsCombined){
        newQuery += (' OR ' +  nounsCombined + ' '  + verbsCombined);
      }
    
      results.add(newQuery);
    }
  
    return results;
  };
  
  // search for news using keywords
  function getQueryResults(keywords){
  
    let parser = new DOMParser();
    let unfinishedPromises = [];
  
    keywords.forEach((query)=>{
      unfinishedPromises.push(
        fetch('https://news.google.com/rss/search?q=' + query + '&hl=en-IN&gl=IN&ceid=IN:en')
          .then(response => response.text())
          .then(xmlString => parser.parseFromString(xmlString, 'text/xml'))
          .then(data => {
            let allTitles = data.querySelectorAll('title');
            let results = [];
            for(let k = 1; k < allTitles.length ; k++){
              results.push(allTitles[k].textContent);
            }
            return results;
          })
      );
    });
  
    return Promise.all(unfinishedPromises).then((values)=>{
      let relatedArticles = [];
      for(let p = 0; p < values.length;p++){
        relatedArticles = relatedArticles.concat(values[p]);
      }
      return new Set(relatedArticles);
    });  
  }
  
  
function handleFactChecker(clickData) {
  let text = clickData.selectionText;
  if (text) {
    getFactCheck(text);
  } else {
    fetch(CONFIG.GET_TEXT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ link: clickData.linkUrl })
    })
      .then(response => response.json())
      .then(result => {
        getFactCheck(result.searchText);
      });
  }
}

function getFactCheck(query) {
  fetch(`${CONFIG.FACT_CHECK_API_URL}?query=${query}&key=${newsKeys}`)
    .then(response => response.text())
    .then(result => {
      let json_result = JSON.parse(result);
      if (json_result['claims']) {
        fetch(CONFIG.SAVE_FC_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: result
        })
          .then(() => console.log('Saved Successfully'))
          .catch(error => console.log('error', error));
      }
      
      chrome.windows.create({
        url: `scripts/content/dii/fcResult.html?api=fc&src=${btoa(unescape(encodeURIComponent(result)))}&searchText=${btoa(unescape(encodeURIComponent(query)))}`,
        focused: true,
        type: 'popup'
      });
    })
    .catch(error => console.log('error', error));
}

function checkWebsite(myWebsite) {
  if (prevWebsite !== myWebsite) {
    console.log('visiting: ' + myWebsite);
    for (var i = 0, len = domainsList.length; i < len; i++) {
      if ((myWebsite === domainsList[i]) || (myWebsite.includes(domainsList[i])) || (domainsList[i].includes(myWebsite))) {
        chrome.notifications.create({
          type: 'basic',
          title: 'Website Info: ' + websites[i],
          message: 'Comments: ' + comments[i],
          iconUrl: '../../assets/icon/72.png'
        });
        break;
      }
    }
  }
  prevWebsite = myWebsite;
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs.length > 0 && tabs[0].url) {
        var myURL = tabs[0].url;
        var match = myURL.match(r);
        if (match) {
          var k = match[1];
          var myWebsite = k.replace(/^(https?:\/\/)?(www\.)?/, '');
          chrome.storage.sync.set({ 'website': myWebsite }, function() {
            console.log('Website stored: ' + myWebsite);
          });
          checkWebsite(myWebsite);
        }
      }
    });
  }
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function(tab) {
    var myURL = tab.url;
    var match = myURL.match(r);
    if (match) {
      var k = match[1];
      var myWebsite = k.replace(/^(https?:\/\/)?(www\.)?/, '');
      chrome.storage.sync.set({ 'website': myWebsite }, function() {
        console.log('Website stored: ' + myWebsite);
      });
      checkWebsite(myWebsite);
    }
  });
});