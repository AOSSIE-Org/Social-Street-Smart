// chrome.storage.sync.remove("settings", ()=>{console.log("removed")})
// console.log("sss.js")
let profanityWords=[];
let reported_contents = ''; // make it globally accessible

var request = new XMLHttpRequest();
var curWebsite='';
var optionsSSS=[];


const URL = chrome.runtime.getURL('../../common/profanity_list_en.json');

async function fetchProfanityWords() {
  try {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const data = await response.json();
    profanityWords = data.list;
    // console.log(profanityWords);
    return profanityWords; // Return the profanityWords if needed elsewhere
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

var settings;
// Use asynchronous storage API in Manifest V3
async function initializeStorage() {
  let result = await chrome.storage.sync.get(['Main_Switch', 'white_list', 'settings', 'reported_contents']);
  let temp = {};

  // Initialize white_list if not present
  if (!result.white_list) {
      // console.log('test');
      temp['white_list'] = '|stackoverflow.com';
      await chrome.storage.sync.set(temp);
  }

  // Initialize reported_contents if not present
  if (!result.reported_contents) {
      temp['reported_contents'] = {
          reported_fake_news: {},
          reported_hate_speech: {}
      };
      await chrome.storage.sync.set(temp);
      window.reported_contents = temp.reported_contents;
  } else {
      window.reported_contents = result.reported_contents;
  }

  // Initialize settings if not present
  if (!result.settings) {
      temp['settings'] = {
          General: { "blur/hide": true },
          "Hate Speech": {
              isEnabled: true,
              facebook: true,
              twitter: true,
              reddit: true,
              otherWebsites: true
          },
          "Click Bait": {
              isEnabled: true,
              facebook: true,
              twitter: true,
              reddit: true,
              otherWebsites: true
          },
          "Profanity Words": {
              isEnabled: true,
              facebook: true,
              twitter: true,
              reddit: true,
              otherWebsites: true
          },
          "Hide Flagged Content": {
              isEnabled: true,
              facebook: true,
              twitter: true,
              reddit: true,
              otherWebsites: true
          },
          "Set Api Keys": [0, 1, 1, 1, 1],
          "Sites Whitelisted": [0, 1, 1, 1, 1]
      };
      await chrome.storage.sync.set(temp);
      settings = temp.settings;
  } else {
      settings = result.settings;
  }

  // Initialize Main_Switch if not present
  if (!result.Main_Switch) {
      temp['Main_Switch'] = true;
      await chrome.storage.sync.set(temp);
  }
}

// Initialize storage on startup
initializeStorage();

function setWebsite(){
  chrome.storage.sync.get(['website'], function(result) {
    console.log("result: ",result)
    curWebsite=result.website;
  });

  
}





async function execute(){
  
  for(var i = 0, len = profanityWords.length; i < len; i++){
    let searchTerm=profanityWords[i];
    matchText(document.body, new RegExp('\\b' + searchTerm + '\\b', 'i'), function(node, match, offset) {
      var span = document.createElement('span');
      // span.parentNode.id="blur";
      span.id = 'SSS-blur'; 
      span.textContent = match;
      span.style.filter='blur(5px)';
      span.addEventListener('mouseover', mouseOver, false);
      span.addEventListener('mouseout', mouseOut, false);
      // console.log("profanity settings")
      return span;
    });
  }
}



var counter=0;
var targetNode = document.body;
//var targetNode = document.getElementsByTagName('div')[0];
var config = {childList:true,subtree: true};


// optionsSSS = ['CB_reddit', 'CB_twitter']


var callback = async function(mutationsList, observer) {
  if ((counter%10) === 0){
    setWebsite()
  }
  var profanity_settings = settings["Profanity Words"]
  if(profanityWords.length==0){
    // console.log("fetching...")
    profanityWords = await fetchProfanityWords();
    // console.log(profanityWords);
  }
  // console.log(profanityWords)
  if(profanity_settings["isEnabled"]){
    // console.log("executing profanity")
    var profanity_web = profanity_settings["otherWebsites"]
    var profanity_facebook = profanity_settings["facebook"]
    var profanity_twitter = profanity_settings["twitter"]
    var profanity_reddit = profanity_settings["reddit"]
    chrome.storage.sync.get(['white_list','Main_Switch'], async function(result) {
      if((result.Main_Switch)&&(!((result.white_list).includes(curWebsite)))){
        if (profanity_facebook||profanity_twitter||profanity_reddit){
          if ((counter%10) === 0){
            await execute();
          }
        }
        if (profanity_web){    
          if ((counter%2) === 0)
          {
            await execute();
          }
        }    
      }
    });
    // console.log("debug 160")
  }

  counter=counter+1;
// }
  mutationsList.forEach(function (mutation) {
    mutation.addedNodes.forEach(function (node) {
      if (node.nodeType === 1) { 
        // console.log(curWebsite);
        // facebook_clickbait(node,true);
        // reddit_clickbait(node,true);
        chrome.storage.sync.get(['white_list','Main_Switch'], function(result) {
          // console.log(settings);
          // console.log("fb today", curWebsite)
          console.log(curWebsite)
          if((result.Main_Switch)&&(!(result.white_list).includes(curWebsite))){
            if (curWebsite==='facebook.com'){
              if(settings["Click Bait"]["isEnabled"] && settings["Click Bait"]["facebook"]){
                if(settings["General"]["blur/hide"]){
                  // console.log("sss fb")
                  facebook_clickbait(node,true); //hide
                }
              }
              if(settings['Hate Speech']["isEnabled"] && settings['Hate Speech']["facebook"]){
                if(settings["General"]["blur/hide"]){
                  facebook_hatespeech(node,true); //hide
                }
                // TODO: implement blur
              }
            }

            if (curWebsite==='twitter.com'){
              if(settings["Click Bait"]["isEnabled"] && settings["Click Bait"]["twitter"]){
                if(settings["General"]["blur/hide"]){
                  // console.log("sss fb")
                  twitter_clickbait(node,true); //hide
                }
              }
              if(settings['Hate Speech']["isEnabled"] && settings['Hate Speech']["twitter"]){

                if(settings["General"]["blur/hide"]){
                  twitter_hatespeech(node,true); //hide
                }

              }

            }

            if (curWebsite==='reddit.com'){
              // console.log(settings)
              // console.log(settings["Click Bait"])
              if(settings["Click Bait"]["isEnabled"] && settings["Click Bait"]["reddit"]){
                // console.log("reddit");
                // console.log(settings["General"]["blur/hide"])
                if(settings["General"]["blur/hide"]){
                  // console.log("sss reddit")
                  reddit_clickbait(node,true); //hide
                }
              }
              if(settings['Hate Speech']["isEnabled"] && settings['Hate Speech']["reddit"]){

                if(settings["General"]["blur/hide"]){
                  reddit_hatespeech(node,true); //hide
                }
              }
            }
          }
        });    
      }});

  });
};


// console.log("sss mutation")
var observer = new MutationObserver(callback);
observer.observe(targetNode, config);

var matchText = function(node, regex, callback, excludeElements) { 
  // console.log(node);
  excludeElements || (excludeElements = ['script', 'style', 'iframe', 'canvas','i','button','input','head','form','noscript','header','img']);
  var child = node.firstChild;

  while (child) {
    switch (child.nodeType) {
      case 1: //ELEMENT_NODE
        if (excludeElements.indexOf(child.tagName.toLowerCase()) > -1)
          break;
        if (child.id !== 'SSS-blur') {
          matchText(child, regex, callback, excludeElements);
        }
            
        break;
      case 3: //CHILD_NODE
        var bk = 0;
        child.data.replace(regex, function(all) {
          var args = [].slice.call(arguments),
            offset = args[args.length - 2],
            newTextNode = child.splitText(offset+bk), tag;
          bk -= child.data.length + all.length;

          newTextNode.data = newTextNode.data.substr(all.length);
          tag = callback.apply(window, [child].concat(args));
          child.parentNode.insertBefore(tag, newTextNode);
          child = newTextNode;
        });
        regex.lastIndex = 0;
        break;
    }

    child = child.nextSibling;
  }

  return node;
};

// get n level parent
function getParentNode(element, level=1) { 
  while(level-- > 0) {
    element = element.parentNode;
    if(!element) {
      return null; 
    }
  }
  return element;
}



function mouseOver()   //to test if pre-commit hook is working fine
{  
  this.style.filter='blur(0px)';
}

function mouseOut()
{  
  this.style.filter='blur(5px)';
}
