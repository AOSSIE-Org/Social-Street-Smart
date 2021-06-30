var r = /:\/\/(.[^/]+)/;
var prevWebsite='';
var myURL = 'about:blank'; // A default url just in case below code doesn't work


var msgs='';
console.log('start');
var URL= chrome.extension.getURL('../../common/news_websites.json');
var request = new XMLHttpRequest();
request.open('GET', URL , false);  // `false` makes the request synchronous
request.send(null);

if (request.status === 200) {
  var msgs = JSON.parse(request.responseText);

}

var creds; 
var newsKeys;
chrome.storage.sync.get('diiKeys', function (result) {
  console.log('Old Keys:');
  console.log(result);
  creds = result.diiKeys;

});

chrome.storage.sync.get('newsKeys', function (result) {
  console.log('Old Keys:');
  console.log(result);
  newsKeys = result.newsKeys;

});

var websites= msgs.Website;
var domainsList= msgs.Domain;
var comments= msgs.Comments;

var newsOriginContextMenu= {
  'id': 'SsSorigin',
  'title': 'Get probable News ',
  'contexts':['selection']
};

var diiContextMenu = {
  'id': 'diiMenu',
  'title': 'Check image for disinformation',
  'contexts': ['image'],
  // onclick:dii
  // handleImageURL(info.srcUrl);
  // console.log(info.url);
  // }
};
var fnContextMenu = {
  'id': 'fnMenu',
  'title': 'Check for Fake News',
  'contexts': ['link', 'selection'],
  // onclick:dii
  // handleImageURL(info.srcUrl);
  // console.log(info.url);
  // }
};

// ################################## Context Menu Options For Report#####################################

// var ReportMenu = {
//   'id': 'report',
//   'title': 'Report',
//   'contexts': ['link', 'selection'],
// };

var ReportFnMenu = {
  'id': 'reportFNMenu',
  'title': 'Report For Fake News',
  'contexts': ['link', 'selection'],
};

var ReportHsMenu = {
  'id': 'reportHSMenu',
  'title': 'Report For Hate Speech',
  'contexts': ['link', 'selection'],
};


chrome.contextMenus.create(ReportFnMenu);
chrome.contextMenus.create(ReportHsMenu);

// ############################################################################



function dii(info){
  console.log(info.srcURL);
}

chrome.contextMenus.create(newsOriginContextMenu);
chrome.contextMenus.create(diiContextMenu);
chrome.contextMenus.create(fnContextMenu);

chrome.contextMenus.onClicked.addListener(function(clickData){
  if(clickData.menuItemId==='SsSorigin' && clickData.selectionText){
    // console.log(clickData.selectionText);
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
      //console.log("received" + clickData.selectionText);
        var data = JSON.parse(xhttp.responseText);
        var info_high = data['HIGH'];
        var info_some = data['SOME'];
        var info_minimal = data['MINIMAL'];

        var notific = {
          type: 'basic',
          title: 'Origin probabilities: ',
          message: 'High:' + info_high + ', SOME: '+ info_some,
          expandedMessage: 'High' + info_minimal,
          iconUrl: '../../assets/icon/72.png'
        };

        console.log(info_high);
        chrome.notifications.create(notific); 
      }
    };

        
    chrome.storage.sync.get('newsKeys', function (result) {
      console.log('Old Keys:');
      console.log(result);
      newsKeys = result.newsKeys;

    });
    xhttp.open('GET', 'https://phcg4hgf84.execute-api.us-east-1.amazonaws.com/dev/pred?text=' + clickData.selectionText + '&key=' + newsKeys, true);
    // xhttp.open('GET', 'http://127.0.0.1:5000/pred?text=' + clickData.selectionText + "&key=" + newsKeys, true);
    xhttp.send();
  }
  
  if(clickData.menuItemId === 'diiMenu'){
    // alert(123)

    var imgSrc = clickData.srcUrl;
    console.log(clickData.srcUrl);

    var urlencoded = new URLSearchParams();

    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    console.log(creds);

    chrome.storage.sync.get('diiKeys', function (result) {
      console.log('Old Keys:');
      console.log(result);
      creds = result.diiKeys;
    
    });

    fetch('https://j9sgfnzwo8.execute-api.us-east-1.amazonaws.com/dev/lookup/?creds=' + creds + '&link=' + imgSrc, requestOptions)
      .then(response => response.text())
      .then(result = (result) => {
        console.log('result' + result); 
        chrome.windows.create({
          url : 'scripts/content/dii/diiResult.html?api=dii&imgsrc=' + btoa(imgSrc) + '&result=' + btoa(result),
          focused : true,
          type : 'popup'});
      })
      .catch(error = (error)=> {
        console.log('error', error);
      });
  }
  if(clickData.menuItemId === 'fnMenu'){
    // alert(clickData.linkUrl)
    url = clickData.linkUrl;
    if(url){
      // alert(url);
      src = 'newsWeb';
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      var raw = '{"source": "newsWeb","body":{"link":"'+ url +'"}}';
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch('https://59rfocmnrd.execute-api.us-east-1.amazonaws.com/dev/predict', requestOptions)
        .then(response => response.text())
        .then(result  = (result) => {
          console.log('result' + result); 
          chrome.windows.create({
            url : 'scripts/content/dii/fnResult.html?api=fn&src=' + btoa(url) + '&result=' + btoa(result),
            focused : true,
            type : 'popup'});
        })
        .catch(error => console.log('error', error));
    }
    else{
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      var raw = JSON.stringify({'source':'FB','body':{'content':clickData.selectionText}});

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch('https://59rfocmnrd.execute-api.us-east-1.amazonaws.com/dev/predict', requestOptions)
        .then(response => response.text())
        .then(result  = (result) => {
          console.log('result' + result); 
          chrome.windows.create({
            url : 'scripts/content/dii/fnResult.html?api=fn&src=' + btoa(clickData.selectionText) + '&result=' + btoa(result),
            focused : true,
            type : 'popup'});
        })
        .catch(error => alert('error', error));
    }
  }
  // ###############################################################################

  if (clickData.menuItemId === 'reportFNMenu'){

    saveToLocalAndDB('reportFNMenu',clickData);
  }
  else if(clickData.menuItemId === 'reportHSMenu'){
    
    saveToLocalAndDB('reportHSMenu',clickData);
  }


});   


// ##############################################################

function saveToLocalAndDB(menuItemId,clickData){
  if( menuItemId === 'reportFNMenu'){
    //do FN stuffs

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
    
        var data = JSON.parse(xhttp.responseText);
    
        chrome.storage.sync.get('reported_contents', function (result) {
    
          if( Object.keys(result).length === 0 ){
            result = {
              'reported_contents': {
                'reported_fake_news' : {}, // local storage only stores arrays or dict
                'reported_hate_speech' : {}
              },
            }; 
          }
    
          result['reported_contents']['reported_fake_news'][data['text']] = null ;
    
          chrome.storage.sync.set(result, function() {
            console.log(result);
          });
    
        });
        

        var notific = {
          type: 'basic',
          title: 'Reported Successfully ',
          message: 'Thanks for your feedback!! ',
          // expandedMessage: 'High' + info_minimal,
          iconUrl: '../../assets/icon/72.png'
        };
        chrome.notifications.create(notific); 
      }
    };

    if (clickData.selectionText){
      xhttp.open('GET', 'https://2vatfr7s1d.execute-api.us-east-2.amazonaws.com/dev/reportfake?text=' + clickData.selectionText, true);
      xhttp.send();
    }
    else{

      var raw = JSON.stringify({'link':clickData.linkUrl});

      xhttp.open('POST', 'https://2vatfr7s1d.execute-api.us-east-2.amazonaws.com/dev/reportfake', true);
      xhttp.setRequestHeader('Content-type', 'application/json');
      xhttp.send(raw);
    }

  }

  else if ( menuItemId === 'reportHSMenu' ){
    //do HS stuffs

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {

        var data = JSON.parse(xhttp.responseText);

        chrome.storage.sync.get('reported_contents', function (result) {
    
          if( Object.keys(result).length === 0 ){
            result = {
              'reported_contents': {
                'reported_fake_news' : {}, // local storage only stores arrays or dict
                'reported_hate_speech' : {}
              },
            }; 
          }
    
          result['reported_contents']['reported_hate_speech'][data['text']] = null ;
    
          chrome.storage.sync.set(result, function() {
            console.log(result);
          });
    
        });
        

        var notific = {
          type: 'basic',
          title: 'Reported Successfully ',
          message: 'Thanks for your feedback!! ',
          // expandedMessage: 'High' + info_minimal,
          iconUrl: '../../assets/icon/72.png'
        };
        chrome.notifications.create(notific); 
      }
    };

    if (clickData.selectionText){
      xhttp.open('GET', 'https://2vatfr7s1d.execute-api.us-east-2.amazonaws.com/dev/reporthate?text=' + clickData.selectionText, true);
      xhttp.send();
    }
    else{

      var raw = JSON.stringify({'link':clickData.linkUrl});

      xhttp.open('POST', 'https://2vatfr7s1d.execute-api.us-east-2.amazonaws.com/dev/reporthate', true);
      xhttp.setRequestHeader('Content-type', 'application/json');
      xhttp.send(raw);
    }

  }
}

// ############################################################################################



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





chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) { // onUpdated should fire when the selected tab is changed or a link is clicked 
  chrome.tabs.getSelected(null, function(tab) {
    myURL = tab.url;
    k=myURL;
    k=myURL.match(r)[1]; 
    myWebsite=k.replace(/^(https?:\/\/)?(www\.)?/,'');  //strips www and https if present
    //console.log(k);
    checkWebsite(myWebsite);

    chrome.storage.sync.set({'website': myWebsite});

    /**
    chrome.storage.sync.get(['website'], function(result) {
          console.log('Value currently is ' + result.website);
        });
      

**/


  });
});
 








