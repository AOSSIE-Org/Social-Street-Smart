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

var creds 
chrome.storage.sync.get('diiKeys', function (result) {
  console.log("Old Keys:")
  console.log(result);
  creds = result.diiKeys;

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
  'contexts': ["image"],
  // onclick:dii
    // handleImageURL(info.srcUrl);
    // console.log(info.url);
  // }
}

function dii(info){
  console.log(info.srcURL);
}

chrome.contextMenus.create(newsOriginContextMenu);
chrome.contextMenus.create(diiContextMenu);

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
    xhttp.open('GET', 'https://phcg4hgf84.execute-api.us-east-1.amazonaws.com/dev/pred?text=' + clickData.selectionText, true);
    xhttp.send();
  }
  if(clickData.menuItemId === 'diiMenu'){
    // alert(123)

    var imgSrc = clickData.srcUrl;
    console.log(clickData.srcUrl)

    var urlencoded = new URLSearchParams();

    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    console.log(creds);

    fetch("http://127.0.0.1:5000/lookup/?creds=" + creds + "&link=" + imgSrc, requestOptions)
    .then(response => response.text())
    .then(result = (result) => {
      console.log("result" + result); 
      chrome.windows.create({
        url : "scripts/content/dii/diiResult.html?imgsrc=" + btoa(imgSrc) + "&result=" + btoa(result),
        focused : true,
        type : "popup"});
    })
    .catch(error => console.log('error', error));
    }
});  













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
 








