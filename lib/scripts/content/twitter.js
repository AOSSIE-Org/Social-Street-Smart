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

function myMain () {
    var tweets= document.getElementsByClassName("js-stream-item stream-item stream-item");
    var totalTweets= tweets.length;
    console.log(totalTweets);
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
        // console.log(tweetHandle[i]);
        // console.log(i)
        if(mediaHandleList.includes(tweetHandle[i])== true)
        {
            requestSD[i]= new XMLHttpRequest();
            requestSD[i].open("POST", url, true);
            requestSD[i].setRequestHeader("Content-Type", "application/json");
            requestSD[i].onload = function ()
            {
                if(requestSD[i].readyState === XMLHttpRequest.DONE  && requestSD[i].status === 200)
                {
                    var json = JSON.parse(requestSDs[i].responseText);
                    var result=json["prediciton"];
                    // UI changes as per predicition
                    if(result=='Disagree')
                    {
                        
                        console.log("fakeNews");
                    }
                } 
            }

        };
        newsCC= JSON.stringify({"queryNews":tweetContent[i]});
        requestSD[i].send(newsCC);
        

    }
}

var targetNode=document.getElementById("stream-items-id");
var config = {childList:true,subtree: true};
var callback = function(mutationsList, observer) {
  myMain();
};

var observer = new MutationObserver(callback);
observer.observe(targetNode, config);