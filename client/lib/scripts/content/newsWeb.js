var currentTab= location;
var apiURL= 'http://127.0.0.1:5000/scrap';
var targetURL= currentTab.href;
var req= new XMLHttpRequest();
req.open('POST', apiURL, true);
//news_script
req.setRequestHeader('Content-Type', 'application/json');
req.onload = function ()
{
  if(req.readyState === XMLHttpRequest.DONE  && req.status === 200) 
  {
    var result = JSON.parse(req.responseText)['prediciton'];
    alert(result);
        
  }
    
};
var reqdata= JSON.stringify(
  {
    'source':'newsWeb',
    'body':{
      'link': targetURL
    }
  }
);
req.send(reqdata);
