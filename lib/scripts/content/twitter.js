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

function myMain () {
    var tweets= document.getElementsByClassName("js-stream-item stream-item stream-item");
    var totalTweets= tweets.length;
    console.log(totalTweets)
    var tweetID= new Array(totalTweets);
    var tweetHandle= new Array(totalTweets);
    var tweetUserName= new Array(totalTweets);
    var tweetContent= new Array(totalTweets);
    // alert("working");
    var requestSD= new Array(totalTweets);
    for(let i= 0;i< totalTweets;i++)
    {
        tweetID[i]= tweets[i].getAttribute("id");
        tweetUserName[i]=tweets[i].getElementsByClassName("fullname show-popup-with-id u-textTruncate")[0].innerText;
        tweetHandle[i]= tweets[i].getElementsByClassName("username u-dir u-textTruncate")[0].innerText;
        tweetContent[i]= tweets[i].getElementsByClassName("TweetTextSize  js-tweet-text tweet-text")[0].innerText;
        xyz=tweets[i].getElementsByClassName("TweetTextSize  js-tweet-text tweet-text")[0];
        console.log(tweetHandle[i]);
        console.log(i)
        
        

    }
}

var targetNode=document.getElementById("stream-items-id");
var config = {childList:true,subtree: true};
var callback = function(mutationsList, observer) {
  myMain();
};

var observer = new MutationObserver(callback);
observer.observe(targetNode, config);