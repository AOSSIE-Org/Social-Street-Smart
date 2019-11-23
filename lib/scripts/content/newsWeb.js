var currentTab= location;
var apiURL= "http://127.0.0.1:5000/scrap";
var targetURL= currentTab.href;
var req= new XMLHttpRequest();
req.open("POST", apiURL, true);
req.setRequestHeader("Content-Type", "application/json");
req.onload = function ()
{
    if(req.readyState === XMLHttpRequest.DONE  && req.status === 200) 
    {
        var result = JSON.parse(req.responseText)['result'];
        console.log(req.statusText);
        console.log("result recieved");
        
    }
    else
    {
        console.log("error");
    }
};
var reqdata= JSON.stringify({'url': targetURL});
req.send(reqdata);

