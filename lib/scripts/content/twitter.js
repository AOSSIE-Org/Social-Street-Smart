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
    "@CNNnews18",
    "@googlenews",
    "@reddit_news",
    "@BBCWorld",
    "@nytimes",
    "@BuzzFeed",
    "@AlJazeera",
    "@Defence_blog",
    "@thecipherbrief",
    "@WarNewsUpdates",
    "@Yahoo",
    "@guardian",
    "@Reuters",
    "@washingtonpost",
    "@timesofindia",
    "@ndtv",
    "@RT_com",
    "@Independent",
    "@SPIEGEL_alles",
    "@NPR",
    "@ExpressNewsUK",
    "@CNBC",
    "@DailyMirror",
    "@CBC",
    "@TIME",
    "@CBSNews",
    "@TheSun",
    "@latimes",
    "@ABC",
    "@voxdotcom",
    "@SkyNews",
    "@smh",
    "@RFI_En",
    "@News24",
    "@RawStory",
    "@euronews",
    "@TheStar_news",
    "@globalnews",
    "@CTVNews",
    "@FRANCE24",
    "@seattletimes",
    "@TPM",
    "@ChannelNewsAsia",
    "@dailytelegraph",
    "@TODAYonline",
    "@csmonitor",
    "@BreakingNews",
    "@WarOnTheRocks",
    "@EveningExpress",
    "@TheIFPNews",
    "@NewspaperWorld",
    "@AsianDNews",
    "@IndiaToday",
    "@IndianExpress",
    "@the_hindu",
    "@CNNnews18",
    "@firstpost",
    "@bsindia",
    "@DNANewsIndia",
    "@DeccanChronicle",
    "@Oneindia",
    "@FinancialXpress",
    "@scroll_in",
    "@Hindu_BL",
    "@TheQuint",
    "@Outlookindia",
    "@fpjindia",
    "@TelanganaToday",
    "@TheAsianAgeNews",
    "@chandigarhmetro",
    "@Daily_Excelsior",
    "@teluguglobal",
    "@jaianndata_news",
    "@StarOfMysore",
    "@NagpurToday",
    "@arunachaltimes_",
    "@RisingKashmir",
    "@mytentaran",
    "@YoVizag",
    "@TheSangaiExpres",
    "@OrissaPOSTLive",
    "@KashmirReader",
    "@statetimes",
    "@TechGenyz",
    "@BhakatNews",
    "@MosesNews1",
    "@EmitPost",
    "@banglarsamai",
    "@News_Himachal",
    "@thenorthlines",
    "@OfficalTMJ",
    "@ElectionTamasha",
    "@themetrotalk",
    "@LeagueOfIndia",
    "@indiannewsqld1",
    "@NewsEkAaina",
    "@sportskanazee",
    "@MetroRailNewsIN",
    "@SpectatorIndian",
    "@EasternHerald",
    "@ASBAnews"

];

function myMain (node) {
    var tweets= node.getElementsByClassName("js-stream-item stream-item stream-item")[0];
    var tweetID=  null;
    var tweetHandle= null;
    var tweetUserName= null;
    var tweetContent= null;
    var requestSD=  null;
    
    tweetID= tweets.getAttribute("id");
    tweetUserName=tweets.getElementsByClassName("fullname show-popup-with-id u-textTruncate ")[0].innerText;
    tweetHandle= tweets.getElementsByClassName("username u-dir u-textTruncate")[0].innerText;
    tweetContent= tweets.getElementsByClassName("TweetTextSize  js-tweet-text tweet-text")[0].innerText;
    // console.log(tweetHandle);
    // console.log
    if(mediaHandleList.includes(tweetHandle)== true)
    {
        requestSD= new XMLHttpRequest();
        requestSD.open("POST", url, true);
        requestSD.setRequestHeader("Content-Type", "application/json");
        requestSD.onload = function ()
        {
            if(requestSD.readyState === XMLHttpRequest.DONE  && requestSD.status === 200)
            {
                var json = JSON.parse(requestSD.responseText);
                var result=json["prediciton"];
                var resultDiv= document.createElement('div');
                resultDiv.style.color = 'rgb(128, 0, 0)';
                resultDiv.style.fontSize = '20px';
                resultDiv.style.textAlign = 'center';
                resultDiv.textContent = result;
                var resultNode= tweets.getElementsByClassName("TweetTextSize  js-tweet-text tweet-text")[0];
                resultNode.append(resultDiv);
            } 
        }
        newsCC= JSON.stringify(
            {
                "source":"Twitter",
                "body":{
                    "tweetID": tweetID,
                    "handle": tweetHandle,
                    "dateTime": "",
                    "content": tweetContent
                }
            }
        );
        requestSD.send(newsCC);
    };
    
    
}

var targetNode=document.getElementById("stream-items-id")
var config = {childList:true,subtree: true};

var callback = function(mutationsList, observer) {
    mutationsList.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
            if(node.nodeType==1){
                    myMain(node);
            };

        });
    });
};
var observer = new MutationObserver(callback);
observer.observe(targetNode, config);