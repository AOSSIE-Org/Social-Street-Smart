let profanityWords='';
let reported_contents = ''; // make it globally accessible

var URL= chrome.extension.getURL('../../common/profanity_list_en.json');
var request = new XMLHttpRequest();
var curWebsite='';
var optionsSSS=[];


request.open('GET', URL , false);  // `false` makes the request synchronous
request.send(null);
if (request.status === 200) {
  var msgs = JSON.parse(request.responseText);
  profanityWords=msgs.list;
}
//console.log(profanityWords);

chrome.storage.sync.get(['Main_Switch', 'white_list', 'options','reported_contents'], function(result)
{
  var temp={};
  //console.log(result.white_list);
  if(!(result.white_list)) {
    console.log('test');
    temp['white_list']='|stackoverflow.com';
    chrome.storage.sync.set(temp);

  }

  // store reported_contents 

  var temp={};
  if(!(result.reported_contents)) {
    temp['reported_fake_news']={};
    temp['reported_hate_speech']={};
    chrome.storage.sync.set(temp);

    reported_contents = temp;
  }
  else{
    reported_contents = result.reported_contents;
  }


  // +++++++++++
  
  var filler=[];
  var temp={};
  if(!(result.options)) {
    temp['options']=filler;
    chrome.storage.sync.set(temp);
    optionsSSS=[];
  }   
  else
  {
    optionsSSS=result.options;
  }
  
  // console.log('optionsSSS')
  // console.log(result.Main_Switch)
  // console.log(result.white_list)
  // console.log(result.options)  
  // console.log('end optionsSSS')
  var temp={};
  if(!(result.Main_Switch)) 
  {
    temp['Main_Switch']='yes';
    chrome.storage.sync.set(temp);
  }

});


function setWebsite(website){
  curWebsite=website;
}

chrome.storage.sync.get(['website'], function(result) {
  setWebsite(result.website);
});




function execute(){
  for(var i = 0, len = profanityWords.length; i < len; i++){
    let searchTerm=profanityWords[i];
    matchText(document.body, new RegExp('\\b' + searchTerm + '\\b', 'i'), function(node, match, offset) {
      var span = document.createElement('span');
      // span.parentNode.id="bblur";
      span.id = 'SSS-blur'; 
      span.textContent = match;
      span.style.filter='blur(5px)';
      span.addEventListener('mouseover', mouseOver, false);
      span.addEventListener('mouseout', mouseOut, false);
      return span;

    });

  }
}



var counter=0;
var targetNode = document.body;
//var targetNode = document.getElementsByTagName('div')[0];
var config = {childList:true,subtree: true};


// optionsSSS = ['CB_reddit', 'CB_twitter']


var callback = function(mutationsList, observer) {
  var profanity_web = ((curWebsite !== 'twitter.com') && (curWebsite !== 'facebook.com')) && (optionsSSS.includes('PW_web'));
  // console.log(optionsSSS);
  var profanity_facebook = (curWebsite==='facebook.com') && (optionsSSS.includes('PW_facebook'));
  var profanity_twitter = (curWebsite==='twitter.com') && (optionsSSS.includes('PW_twitter'));
  var profanity_reddit = (curWebsite==='reddit.com') && (optionsSSS.includes('PW_reddit'));
  chrome.storage.sync.get(['white_list','Main_Switch'], function(result) {
    if((result.Main_Switch==='yes')&&(!((result.white_list).includes(curWebsite)))){
      if(!(optionsSSS.includes('disable_profanity_words'))){
        if (profanity_facebook||profanity_twitter||profanity_reddit){
          if ((counter%10) === 0){
            execute();
          }
        }
        if (profanity_web){    
          if ((counter%2) === 0)
          {
            execute();
          }
        }    
      }
    }
  });


  counter=counter+1;
  mutationsList.forEach(function (mutation) {
    mutation.addedNodes.forEach(function (node) {
      if (node.nodeType === 1) { 
        // console.log(curWebsite);
        chrome.storage.sync.get(['white_list','Main_Switch'], function(result) {
          if((result.Main_Switch==='yes')&&(!((result.white_list).includes(curWebsite)))){
            if (curWebsite==='facebook.com'){
              if(optionsSSS.includes('CB_facebook')  && (!(optionsSSS.includes('disable_click_baits')))){

                if(optionsSSS.includes('HC_facebook')  && (!(optionsSSS.includes('disable_hide_contents')))){
                  facebook_clickbait(node,true); //hide
                }
                else{
                  facebook_clickbait(node); //unhide
                }
              }
              if(optionsSSS.includes('HS_facebook')&&(!(optionsSSS.includes('disable_hate_speech')))){

                if(optionsSSS.includes('HC_facebook')  && (!(optionsSSS.includes('disable_hide_contents')))){
                  facebook_hatespeech(node,true); //hide
                }
                else{
                  facebook_hatespeech(node); //unhide
                }

              }
              // hide user reported contents
              if(optionsSSS.includes('HC_facebook')  && (!(optionsSSS.includes('disable_hide_contents')))){
                hideReported_facebook(node); //hide
              }

            }

            if (curWebsite==='twitter.com'){
              if(optionsSSS.includes('CB_twitter') && (!(optionsSSS.includes('disable_click_baits')))){

                if(optionsSSS.includes('HC_twitter')  && (!(optionsSSS.includes('disable_hide_contents')))){
                  twitter_clickbait(node,true); //hide
                }
                else{
                  twitter_clickbait(node); //unhide
                }
              
              }
              if(optionsSSS.includes('HS_twitter')&&(!(optionsSSS.includes('disable_hate_speech')))){

                if(optionsSSS.includes('HC_twitter')  && (!(optionsSSS.includes('disable_hide_contents')))){
                  twitter_hatespeech(node,true); //hide
                }
                else{
                  twitter_hatespeech(node); //unhide
                }
              }
              // hide user reported contents
              if(optionsSSS.includes('HC_twitter')  && (!(optionsSSS.includes('disable_hide_contents')))){
                hideReported_twitter(node); //hide
              }

            }

            if (curWebsite==='reddit.com'){
              if(optionsSSS.includes('CB_reddit') && (!(optionsSSS.includes('disable_click_baits')))){
                // check if hide contents is selected.
                if(optionsSSS.includes('HC_reddit')  && (!(optionsSSS.includes('disable_hide_contents')))){
                  reddit_clickbait(node,true); //hide
                }
                else{
                  // reddit_clickbait(node,hide = false)
                  reddit_clickbait(node);
                }
                
              }
              if(optionsSSS.includes('HS_reddit')&&(!(optionsSSS.includes('disable_hate_speech')))){

                if(optionsSSS.includes('HC_reddit')  && (!(optionsSSS.includes('disable_hide_contents')))){
                  reddit_hatespeech(node,true); //hide
                }
                else{
                  reddit_hatespeech(node);
                }
                
              }
              // hide user reported contents
              if(optionsSSS.includes('HC_reddit')  && (!(optionsSSS.includes('disable_hide_contents')))){
                hideReported_reddit(node); //hide
              }


            }

            if (curWebsite==='youtube.com'){
              if(optionsSSS.includes('CB_youtube')&&(!(optionsSSS.includes('disable_click_baits')))){
                youtube_clickbait(node);
              }
              if(optionsSSS.includes('HS_youtube')&&(!(optionsSSS.includes('disable_hate_speech')))){
                //youtube_hatespeech(node);     <<TBD>>
              }
            }
          }
        });    
      }});

  });
};



var observer = new MutationObserver(callback);
observer.observe(targetNode, config);

var matchText = function(node, regex, callback, excludeElements) { 

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

