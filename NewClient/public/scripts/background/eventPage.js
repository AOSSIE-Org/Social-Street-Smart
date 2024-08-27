import { CONFIG } from './config.js';

var r = /:\/\/(.[^/]+)/;
 
var prevWebsite='';
var myURL = 'about:blank'; // A default url just in case below code doesn't work

var msgs='';
console.log('start');

async function fetchNewsWebsites() {
  try {
    const URL = chrome.runtime.getURL('common/news_websites.json');
    const response = await fetch(URL);
    if (response.ok) {
      const msgs = await response.json();
      console.log(msgs);
    } else {
      console.error('Failed to fetch JSON:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error fetching JSON:', error);
  }
}

fetchNewsWebsites();

var websites= msgs.Website;
var domainsList= msgs.Domain;
var comments= msgs.Comments;

// Function to get values from chrome.storage.sync using Promises
function getFromStorage(keys) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(keys, function(result) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result);
      }
    });
  });
}

// Initialize the context menus when the extension is installed
chrome.runtime.onInstalled.addListener(async () => {
  try {
    const { diiKeys } = await getFromStorage('diiKeys');
    const { newsKeys } = await getFromStorage('newsKeys');
    console.log('Old Keys:', diiKeys, newsKeys);

    // ########### Context Menu Options For SSL & Security Header Checker ############
    chrome.contextMenus.create({
      id: 'CheckShcMenu',
      title: 'Check URL Safety',
      contexts: ['link', 'selection'],
    });

    chrome.contextMenus.create({
      id: 'CheckSslMenu',
      title: 'Check SSL Validity',
      contexts: ['link', 'selection'],
    });

    // ################################## Context Menu Options For Report #####################################
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
      title: 'Summarize Text or Link',
      contexts: ['link', 'selection'],
    });

    // ################################## Custom Context Menu Options #####################################

    chrome.contextMenus.create({
      id: 'SsSorigin',
      title: 'Get Probable News Origin',
      contexts: ['selection'],
    });

    chrome.contextMenus.create({
      id: 'diiMenu',
      title: 'Check Image for Disinformation',
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

  } catch (error) {
    console.error('Error accessing chrome storage:', error);
  }
});

// Listener for context menu click events
chrome.contextMenus.onClicked.addListener((clickData) => {
  if (clickData.menuItemId === 'SsSorigin' && clickData.selectionText) {
    fetchOriginProbabilities(clickData.selectionText);
  }
  // Add other menu item handlers as needed
});

async function fetchOriginProbabilities(selectedText) {
  try {
    const response = await fetch(`https://example.com/api/origin?text=${encodeURIComponent(selectedText)}`);
    if (response.ok) {
      const data = await response.json();
      const info_high = data['HIGH'];
      const info_some = data['SOME'];
      const info_minimal = data['MINIMAL'];

      const notific = {
        type: 'basic',
        title: 'Origin Probabilities',
        message: `High: ${info_high}, Some: ${info_some}, Minimal: ${info_minimal}`,
        iconUrl: 'assets/icon/72.png'
      };

      chrome.notifications.create('', notific);
    } else {
      console.error('Failed to fetch origin probabilities:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error fetching origin probabilities:', error);
  }
}



chrome.contextMenus.onClicked.addListener(function(clickData){
//   if(clickData.menuItemId==='SsSorigin' && clickData.selectionText){
//     // console.log(clickData.selectionText);
//     var xhttp = new XMLHttpRequest();

//     xhttp.onreadystatechange = function() {
//       if (this.readyState === 4 && this.status === 200) {
//       //console.log("received" + clickData.selectionText);
//         var data = JSON.parse(xhttp.responseText);
//         var info_high = data['HIGH'];
//         var info_some = data['SOME'];
//         var info_minimal = data['MINIMAL'];

//         var notific = {
//           type: 'basic',
//           title: 'Origin probabilities: ',
//           message: 'High:' + info_high + ', SOME: '+ info_some,
//           expandedMessage: 'High' + info_minimal,
//           iconUrl: '../../assets/icon/72.png'
//         };

//         console.log(info_high);
//         chrome.notifications.create(notific); 
//       }
//     };

        
//     chrome.storage.sync.get('newsKeys', function (result) {
//       console.log('Old Keys:');
//       console.log(result);
//       newsKeys = result.newsKeys;

//     });
//     xhttp.open('GET', 'https://phcg4hgf84.execute-api.us-east-1.amazonaws.com/dev/pred?text=' + clickData.selectionText + '&key=' + newsKeys, true);
//     // xhttp.open('GET', 'http://127.0.0.1:5000/pred?text=' + clickData.selectionText + "&key=" + newsKeys, true);
//     xhttp.send();
//   }
  
//   if(clickData.menuItemId === 'diiMenu'){
//     // alert(123)

//     var imgSrc = clickData.srcUrl;
//     console.log(clickData.srcUrl);

//     var urlencoded = new URLSearchParams();

//     var requestOptions = {
//       method: 'GET',
//       redirect: 'follow'
//     };

//     console.log(creds);

//     chrome.storage.sync.get('diiKeys', function (result) {
//       console.log('Old Keys:');
//       console.log(result);
//       creds = result.diiKeys;
    
//     });

//     fetch('https://j9sgfnzwo8.execute-api.us-east-1.amazonaws.com/dev/lookup/?creds=' + creds + '&link=' + imgSrc, requestOptions)
//       .then(response => response.text())
//       .then(result = (result) => {
//         console.log('result' + result); 
//         chrome.windows.create({
//           url : 'scripts/content/dii/diiResult.html?api=dii&imgsrc=' + btoa(imgSrc) + '&result=' + btoa(result),
//           focused : true,
//           type : 'popup'});
//       })
//       .catch(error = (error)=> {
//         console.log('error', error);
//       });
//   }
  //######################## SHC and SSL Checker Api ######################

  if (clickData.menuItemId === 'CheckShcMenu') {
    console.log(clickData);
    let targetUrl = clickData.selectionText;

    var requestOptions = {
        method: 'GET',
    };
    fetch(`${CONFIG.SHC_API_URL}/shc?url=${encodeURIComponent(targetUrl)}`, requestOptions)
    // fetch('http://127.0.0.1:5000/shc?url=' + encodeURIComponent(targetUrl), requestOptions)
      .then(response => response.json())
      .then(result => {
          console.log(result);
          chrome.windows.create({
              url: 'scripts/content/shc/shcResult.html?api=shc&score=' + btoa(result.Score) + '&valid=' + btoa(result.isValid) + '&target=' + btoa(result.url),
              focused: true,
              type: 'popup'
          });
      })
      .catch(error => {
          console.log('error', error);
      });
  }

  if (clickData.menuItemId === 'CheckSslMenu') {
  console.log("clickData", clickData);
  let targetUrl = clickData.selectionText;

  console.log(targetUrl);
  var requestOptions = {
      method: 'GET',
  };

  // fetch('http://127.0.0.1:5000/ssl?url=' + encodeURIComponent(targetUrl), requestOptions)
  fetch(`${CONFIG.SSL_API_URL}/ssl?url=` + encodeURIComponent(targetUrl), requestOptions)
    .then(response => response.json())
    .then(result => {
        console.log(result);
        chrome.windows.create({
            url: 'scripts/content/shc/shcResult.html?api=ssl&safe=' + btoa(result.isSafe) + '&valid=' + btoa(result.isValid) + '&target=' + btoa(result.url),
            focused: true,
            type: 'popup'
        });
    })
    .catch(error => {
        console.log('error', error);
    });
  }
  


  // ############################# summarizar ############################
  if (clickData.menuItemId === 'summarizar') {
    let targetUrl = clickData.selectionText;
    fetch(`${CONFIG.SUMMARIZE_API_URL}/pred?text=` + encodeURIComponent(targetUrl))
      .then(response => response.json())
      .then(data => {
        // Extract the result from the response
        let resultText = data.Result;
        
        chrome.windows.create({
          url: 'scripts/content/summarizar/summarizar.html?summary=' + encodeURIComponent(resultText),
          focused: true,
          type: 'popup'
        });
      })
      .catch(error => console.error('Error fetching the summary:', error));
  }
  
  // // ######################### Fake News New API ##################################

  // if(clickData.menuItemId === 'fnMenu'){
    
  //   let text = '';

  //   if(clickData.selectionText){
  //     text = clickData.selectionText;
  //     checkFakeNews(text);
  //   }
  //   else{

  //     let data = JSON.stringify({'link': clickData.linkUrl});

  //     let getText = {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: data
  //     };

  //     fetch('https://se7c1fy10c.execute-api.us-east-2.amazonaws.com/dev/getText',getText)
  //       .then(response => response.json())
  //       .then(result =>{
  //         text = result['searchText'];
  //         checkFakeNews(text);
  //       });
  //   }

  // }

  // ###############################################################################

  
  // fact checker
//   if(clickData.menuItemId === 'fcMenu'){
    
//     let text = '';

//     if(clickData.selectionText){
//       text = clickData.selectionText;
//       getFactCheck(text);
//     }
//     else{

//       let data = JSON.stringify({'link': clickData.linkUrl});

//       let getText = {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: data
//       };

//       fetch('https://se7c1fy10c.execute-api.us-east-2.amazonaws.com/dev/getText',getText)
//         .then(response => response.json())
//         .then(result =>{
//           text = result['searchText'];
//           getFactCheck(text);
//         });
//     }  
//   }
// });   




// report a post
// if (clickData.menuItemId === 'reportFNMenu' || clickData.menuItemId === 'reportHSMenu'){
//   saveToLocalAndDB(clickData.menuItemId , clickData);
// }
// // report posts helper function
// function saveToLocalAndDB(menuItemId,clickData){
//   if( menuItemId === 'reportFNMenu'){
//     //do FN stuffs

//     var xhttp = new XMLHttpRequest();

//     xhttp.onreadystatechange = function() {
//       if (this.readyState === 4 && this.status === 200) {
    
//         var data = JSON.parse(xhttp.responseText);
    
//         chrome.storage.sync.get('reported_contents', function (result) {
    
//           if( Object.keys(result).length === 0 ){
//             result = {
//               'reported_contents': {
//                 'reported_fake_news' : {}, // local storage only stores arrays or dict
//                 'reported_hate_speech' : {}
//               },
//             }; 
//           }
    
//           result['reported_contents']['reported_fake_news'][data['text']] = null ;
    
//           chrome.storage.sync.set(result, function() {
//             console.log(result);
//           });
    
//         });
        

//         var notific = {
//           type: 'basic',
//           title: 'Reported Successfully ',
//           message: 'Thanks for your feedback!! ',
//           // expandedMessage: 'High' + info_minimal,
//           iconUrl: '../../assets/icon/72.png'
//         };
//         chrome.notifications.create(notific); 
//       }
//     };

//     if (clickData.selectionText){

//       chrome.storage.sync.get('reported_contents', function (result) {

//         // request only if not reported earlier
//         if(result.reported_contents.reported_fake_news[clickData.selectionText] === undefined){
//           xhttp.open('GET', 'https://se7c1fy10c.execute-api.us-east-2.amazonaws.com/dev/reportfake?text=' + clickData.selectionText, true);
//           xhttp.send();
//         }

//       });

//     }
//     else{
//       var raw = JSON.stringify({'link':clickData.linkUrl});

//       xhttp.open('POST', 'https://se7c1fy10c.execute-api.us-east-2.amazonaws.com/dev/reportfake', true);
//       xhttp.setRequestHeader('Content-type', 'application/json');
//       xhttp.send(raw);
//     }

//   }

//   else if ( menuItemId === 'reportHSMenu' ){
//     //do HS stuffs

//     var xhttp = new XMLHttpRequest();

//     xhttp.onreadystatechange = function() {
//       if (this.readyState === 4 && this.status === 200) {

//         var data = JSON.parse(xhttp.responseText);

//         chrome.storage.sync.get('reported_contents', function (result) {
    
//           if( Object.keys(result).length === 0 ){
//             result = {
//               'reported_contents': {
//                 'reported_fake_news' : {}, // local storage only stores arrays or dict
//                 'reported_hate_speech' : {}
//               },
//             }; 
//           }
    
//           result['reported_contents']['reported_hate_speech'][data['text']] = null ;
    
//           chrome.storage.sync.set(result, function() {
//             console.log(result);
//           });
    
//         });
        

//         var notific = {
//           type: 'basic',
//           title: 'Reported Successfully ',
//           message: 'Thanks for your feedback!! ',
//           // expandedMessage: 'High' + info_minimal,
//           iconUrl: '../../assets/icon/72.png'
//         };
//         chrome.notifications.create(notific); 
//       }
//     };

//     if (clickData.selectionText){

//       chrome.storage.sync.get('reported_contents', function (result) {

//         // request only if not reported earlier
//         if(result['reported_contents']['reported_hate_speech'][clickData.selectionText] === undefined){
//           xhttp.open('GET', 'https://se7c1fy10c.execute-api.us-east-2.amazonaws.com/dev/reporthate?text=' + clickData.selectionText, true);
//           xhttp.send();
//         }

//       });

//     }
//     else{

//       var raw = JSON.stringify({'link':clickData.linkUrl});

//       xhttp.open('POST', 'https://se7c1fy10c.execute-api.us-east-2.amazonaws.com/dev/reporthate', true);
//       xhttp.setRequestHeader('Content-type', 'application/json');
//       xhttp.send(raw);
//     }

//   }
// }



// Handles user clicks to report posts
if (clickData.menuItemId === 'reportFNMenu' || clickData.menuItemId === 'reportHSMenu') {
  saveToLocalAndDB(clickData.menuItemId, clickData);
}



// // generate keywords
// function getSearchKeywords(query){

//   const results = new Set();

//   results.add(query); // search for the whole text

//   let docx = nlp(query);
//   let sentences = docx.sentences().data();


//   for(let i = 0;i< sentences.length;i++){
//     let sent = sentences[i].text;
//     results.add(sent);

//     let tempDocx = nlp(sent);

//     let nounsCombined = tempDocx.nouns().text();
//     let adjectivesCombined = tempDocx.adjectives().text();
//     let verbsCombined = tempDocx.verbs().text() ;

//     let newQuery = nounsCombined;
//     if (adjectivesCombined){
//       newQuery += (' OR ' +  nounsCombined + ' '  + adjectivesCombined);
//     }
//     if (verbsCombined){
//       newQuery += (' OR ' +  nounsCombined + ' '  + verbsCombined);
//     }
  
//     results.add(newQuery);
//   }

//   return results;
// };

// // search for news using keywords
// function getQueryResults(keywords){

//   let parser = new DOMParser();
//   let unfinishedPromises = [];

//   keywords.forEach((query)=>{
//     unfinishedPromises.push(
//       fetch('https://news.google.com/rss/search?q=' + query + '&hl=en-IN&gl=IN&ceid=IN:en')
//         .then(response => response.text())
//         .then(xmlString => parser.parseFromString(xmlString, 'text/xml'))
//         .then(data => {
//           let allTitles = data.querySelectorAll('title');
//           let results = [];
//           for(let k = 1; k < allTitles.length ; k++){
//             results.push(allTitles[k].textContent);
//           }
//           return results;
//         })
//     );
//   });

//   return Promise.all(unfinishedPromises).then((values)=>{
//     let relatedArticles = [];
//     for(let p = 0; p < values.length;p++){
//       relatedArticles = relatedArticles.concat(values[p]);
//     }
//     return new Set(relatedArticles);
//   });  
// }

// // fact check helper function
// function getFactCheck(query){

//   var requestOptions = {
//     method: 'GET',
//     redirect: 'follow'
//   };

//   // requires user's API key
//   chrome.storage.sync.get('newsKeys', function (result) {
//     creds = result.newsKeys;

//     // fetch when keys are found
//     fetch('https://factchecktools.googleapis.com/v1alpha1/claims:search?query=' + query +'&key=' + creds, requestOptions)
//       .then(response => response.text())
//       .then(result = (result) => {

//         let json_result = JSON.parse(result); // save results only when claims are found
//         if(json_result['claims']){

//           //store to the results to the database
//           let saveResultOptions = {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json'
//             },
//             body: result
//           };

//           fetch('https://se7c1fy10c.execute-api.us-east-2.amazonaws.com/dev/savefc',saveResultOptions)
//             .then((response) => {
//               console.log('Saved Successfully');
//             })
//             .catch(error = (error)=> {
//               console.log('error', error);
//             });
//         }
        
//         chrome.windows.create({
//           url : 'scripts/content/dii/fcResult.html?api=fc&src=' + btoa(unescape(encodeURIComponent(result))) + '&searchText=' + btoa(unescape(encodeURIComponent(query))),
//           focused : true,
//           type : 'popup'});
//       })
//       .catch(error = (error)=> {
//         console.log('error', error);
//       });

//   });
// }




// // fake news helper function
// function checkFakeNews(query){
//   let searchKeyWords = getSearchKeywords(query); // returns a set object
//   let relatedArticles = getQueryResults(searchKeyWords); // a promise

//   relatedArticles.then((data)=>{ 
//     // now send request to server for prediction
//     // data returned is of type {set}
//     var myHeaders = new Headers();
//     myHeaders.append('Content-Type', 'application/json');
//     var raw = JSON.stringify({'query':query,'relatedArticles': Array.from(data)}); //cant send set object

//     var requestOptions = {
//       method: 'POST',
//       headers: myHeaders,
//       body: raw,
//       redirect: 'follow'
//     };

//     fetch('https://e9jbajkrq6.execute-api.us-east-2.amazonaws.com/dev/predict', requestOptions)
//       .then(response => response.text())
//       .then(result  = (result) => {
//         console.log('result' + result); 
//         chrome.windows.create({
//           url : 'scripts/content/dii/fnResult.html?api=fn&src=' + btoa(unescape(encodeURIComponent(query))) + '&result=' + btoa(unescape(encodeURIComponent(result))),
//           focused : true,
//           type : 'popup'});
//       })
//       .catch(error => alert('error', error));
//   });
// }



function checkWebsite(myWebsite){

  if (prevWebsite!==myWebsite){
    console.log('visiting: ' + myWebsite);
    // console.log(domainsList.length);

    for(var i = 0, len = 1964; i < len; i++) {
      if ( (myWebsite===domainsList[i]) || (myWebsite.includes(domainsList[i])) || (domainsList[i].includes(myWebsite)) ) { //compares if website is in the list
        var opt = {
          type: 'basic',
          title: 'Webite Info: ' + websites[i],
          message: 'Comments: ' + comments[i],
          iconUrl: '../../assets/icon/72.png'
        };

        chrome.notifications.create(opt);
        break;
      }
    }
  }
  prevWebsite=myWebsite;
}


// console.log("event page started")
// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//   // Ensure the tab is fully loaded before processing
//   if (changeInfo.status === 'complete') {
//     chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//       console.log(tabs)
//       var myURL = tabs[0].url;
//       var match = myURL.match(r);
      
//       if (match) {
//         var k = match[1];
//         var myWebsite = k.replace(/^(https?:\/\/)?(www\.)?/, ''); // strips www and https if present
//         checkWebsite(myWebsite);
//         // console.log
//         chrome.storage.sync.set({'website': myWebsite}, function() {
//           console.log('Website stored: ' + myWebsite);
//         });
//       } else {
//         console.error('No match found for URL: ' + myURL);
//       }
//     });
  // }
// });



})
console.log("Event page started");

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // Ensure the tab is fully loaded before processing
  if (changeInfo.status === 'complete') {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs.length > 0 && tabs[0].url) {
        console.log(tabs)
        var myURL = tabs[0].url;
        console.log("Current tab URL:", myURL);

        var match = myURL.match(r);
        console.log(match)
        if (match) {
          var k = match[1];
          var myWebsite = k.replace(/^(https?:\/\/)?(www\.)?/, ''); // strips www and https if present
          // checkWebsite(myWebsite);

          chrome.storage.sync.set({'website': myWebsite}, function() {
            console.log('Website stored: ' + myWebsite);
          });
        } else {
          console.error('No match found for URL: ' + myURL);
        }
      } else {
        console.error('No URL found in the tab or tab list is empty.');
      }
    });
  }
});

// chrome.tabs.onActivated.addListener(function(activeInfo) {
//   chrome.tabs.get(activeInfo.tabId, function(tab) {
//     console.log('Active Tab URL:', tab.url);
//     var myURL = tab[0].url;
//     var match = myURL.match(r);
//     console.log(match)
//     if (match) {
//       var k = match[1];
//       var myWebsite = k.replace(/^(https?:\/\/)?(www\.)?/, '');
//       chrome.storage.sync.set({'website': myWebsite}, function() {
//         console.log('Website stored: ' + myWebsite);
//       });
//     }
//   });
// });


// Helper function to report content and save to local storage
// Helper function to report content and save to local storage
async function saveToLocalAndDB(menuItemId, clickData) {
  const isFakeNews = menuItemId === 'reportFNMenu';
  const apiUrl = isFakeNews
    ? `${CONFIG.REPORT_API_URL}/reportfake`
    : `${CONFIG.REPORT_API_URL}/reporthate`;

  try {
    const requestOptions = buildRequestOptions(clickData, isFakeNews);
    const response = await fetch(apiUrl, requestOptions);

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();

    // Check if the 'text' key is in the response data
    if (!data['text']) {
      throw new Error('Response data does not contain text');
    }

    // Retrieve and update local storage
    let result = await chrome.storage.sync.get('reported_contents', (result)=>{console.log(result)});
    result = initializeStorageIfEmpty(result);

    const contentKey = isFakeNews ? 'reported_fake_news' : 'reported_hate_speech';
    result['reported_contents'][contentKey][data['text']] = null;

    await chrome.storage.sync.set(result);

    // Show success notification
    showNotification('Reported Successfully', 'Thanks for your feedback!!');
  } catch (error) {
    console.error(`Error reporting ${isFakeNews ? 'fake news' : 'hate speech'}:`, error);
  }
}


// Build request options based on the click data and content type
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
    body: JSON.stringify({ link: clickData.selectionText })
  };
}

// Check if the string is a URL
function isUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Initialize storage if it is empty
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

// Show a notification to the user
function showNotification(title, message) {
  const notificationOptions = {
    type: 'basic',
    title,
    message,
    iconUrl: '../../assets/icon/72.png'
  };
  chrome.notifications.create(notificationOptions);
}