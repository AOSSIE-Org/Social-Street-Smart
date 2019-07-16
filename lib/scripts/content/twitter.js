var url= "http://13.233.115.232:8091/predict";
var mediaHandleList= [
    "@guardian",
    "@washingtonpost",
    "@cnni",
    "@BBC",
    "@cspan",
    "@ndtv",
    "@BreitbartNews",
    "@htTweets",
    "@the_hindu",
    "@TOIIndiaNews",
    "@PTI_News",
    "@firstpost",
    "@Reuters",
    "@business",
    "@FT",
    "@Telegraph",
    "@nytimes",
    "@DailyMirror",
    "@RT_com",
    "@Independent",
    "@CNNnews18"
];


var targetNode=document.getElementById("stream-items-id");
var config = {childList:true,subtree: true};
var callback = function(mutationsList, observer) {
  myMain();
};

var observer = new MutationObserver(callback);
observer.observe(targetNode, config);