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
    .catch(error = (error)=> {
      console.log('error', error)
      // chrome.windows.create({
      //   url : "scripts/content/dii/diiResult.html?imgsrc=" + btoa(imgSrc) + "&result=" + "Ww0KICAgIHsNCiAgICAgICAgInRpdGxlIjogIiAiLA0KICAgICAgICAidXJsIjogImh0dHBzOi8vZWNvbm9taWN0aW1lcy5pbmRpYXRpbWVzLmNvbS9uZXdzL3BvbGl0aWNzLWFuZC1uYXRpb24vcG0tbW9kaS10by1hZGRyZXNzLW1hbm4ta2ktYmFhdC1hdC0xMS1hbS10b2RheS9hcnRpY2xlc2hvdy83NTM4NTMwMy5jbXMiDQogICAgfSwNCiAgICB7DQogICAgICAgICJ0aXRsZSI6ICIgIiwNCiAgICAgICAgInVybCI6ICJodHRwczovL20uZWNvbm9taWN0aW1lcy5jb20vbmV3cy9wb2xpdGljcy1hbmQtbmF0aW9uL3BtLW1vZGktdG8tYWRkcmVzcy1tYW5uLWtpLWJhYXQtYXQtMTEtYW0tdG9kYXkvYXJ0aWNsZXNob3cvNzUzODUzMDMuY21zIg0KICAgIH0sDQogICAgew0KICAgICAgICAidGl0bGUiOiAiICIsDQogICAgICAgICJ1cmwiOiAiaHR0cDovL2RkbmV3cy5nb3YuaW4vbmF0aW9uYWwvcHJpbWUtbWluaXN0ZXItbmFyZW5kcmEtbW9kaS1ob2xkcy10ZWxlcGhvbmljLWNvbnZlcnNhdGlvbi1wcmVzaWRlbnQtaW5kb25lc2lhIg0KICAgIH0sDQogICAgew0KICAgICAgICAidGl0bGUiOiAiICIsDQogICAgICAgICJ1cmwiOiAiaHR0cHM6Ly93d3cubGl2ZW1pbnQuY29tL25ld3MvaW5kaWEvcG0tbW9kaS1ob2xkcy1jb25zdWx0YXRpb25zLXdpdGgtMy1zZXJ2aWNlLWNoaWVmcy1hbmQtbnNhLWFtaWQtY2hpbmEtdGVuc2lvbnMtYWxvbmctdGhlLWxhYy0xMTU5MDUwMDczNTcwNy5odG1sIg0KICAgIH0sDQogICAgew0KICAgICAgICAidGl0bGUiOiAiICIsDQogICAgICAgICJ1cmwiOiAiaHR0cHM6Ly93d3cubGl2ZW1pbnQuY29tL3BvbGl0aWNzL25ld3MvcG0tbW9kaS10by1ob2xkLXZpcnR1YWwtYmlsYXRlcmFsLXN1bW1pdC13aXRoLWF1c3RyYWxpYW4tY291bnRlcnBhcnQtbmV4dC13ZWVrLTExNTkwNjkyOTY4MTUyLmh0bWwiDQogICAgfSwNCiAgICB7DQogICAgICAgICJ0aXRsZSI6ICIgIiwNCiAgICAgICAgInVybCI6ICJodHRwczovL20uZWNvbm9taWN0aW1lcy5jb20vbmV3cy9wb2xpdGljcy1hbmQtbmF0aW9uLzcwLXBlci1jZW50LW9mLXBlb3BsZS13YW50LW1vZGktdG8tYmUtcG0tZm9yLWFub3RoZXItdGVybS15ZWRpeXVyYXBwYS9hcnRpY2xlc2hvdy83NjEzODA0Mi5jbXMiDQogICAgfSwNCiAgICB7DQogICAgICAgICJ0aXRsZSI6ICIgIiwNCiAgICAgICAgInVybCI6ICJodHRwOi8vZGRuZXdzLmdvdi5pbi9uYXRpb25hbC9wbS1tb2RpLWhvbGRzLWNvbXByZWhlbnNpdmUtbWVldGluZy1kaXNjdXNzLXN0cmF0ZWdpZXMtYXR0cmFjdC1pbnZlc3RtZW50cy1hbWlkLXBhbmRlbWljIg0KICAgIH0sDQogICAgew0KICAgICAgICAidGl0bGUiOiAiICIsDQogICAgICAgICJ1cmwiOiAiaHR0cHM6Ly93d3cuZGVjY2FuaGVyYWxkLmNvbS9uYXRpb25hbC9yZWNvcmQtMjAzLWNyLXBlb3BsZS13YXRjaGVkLXBtLW5hcmVuZHJhLW1vZGlzLWFkZHJlc3Mtb24tY29yb25hdmlydXMtbG9ja2Rvd24tMi1iYXJjLTgyNjE3NC5odG1sIg0KICAgIH0sDQogICAgew0KICAgICAgICAidGl0bGUiOiAiICIsDQogICAgICAgICJ1cmwiOiAiaHR0cDovL2RkbmV3cy5nb3YuaW4vbmF0aW9uYWwvcG0tbW9kaS1jaGFpcnMtam9pbnQtbWVldGluZy1lbXBvd2VyZWQtZ3JvdXBzLWNvbnN0aXR1dGVkLXBsYW5uaW5nLWFuZC1lbnN1cmluZyINCiAgICB9LA0KICAgIHsNCiAgICAgICAgInRpdGxlIjogIiAiLA0KICAgICAgICAidXJsIjogImh0dHBzOi8vd3d3LmluZGlhdG9kYXkuaW4vaW5kaWEvc3RvcnkvcG0tbmFyZW5kcmEtbW9kaS1hZGRyZXNzLXRvLW5hdGlvbi10b2RheS04cG0tdGltaW5nLWhvdy10by13YXRjaC1saXZlLXRlbGVjYXN0LW9mLXBtLW1vZGktc3BlZWNoLTE2NzcxMTAtMjAyMC0wNS0xMiINCiAgICB9DQpd",
      //   focused : true,
      //   type : "popup"});
      });
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
 








