var apiURL= "http://13.233.115.232:8091/predict";
alert("started");
var mediaPageList=[
    "Google News",
    "Reddit News",
    "BBC News",
    "The New York Times",
    "BuzzFeed",
    "AL Jazeera English",
    "Defence Blog",
    "Global Issues",
    "The Cipher Brief",
    "Yahoo News",
    "The Guardian",
    "Reuters",
    "Washington Post World",
    "The Times of India",
    "NDTV",
    "Rt-News",
    "The Independent",
    "SPIEGEL International",
    "NPR",
    "CNBC International",
    "Daily Mirror",
    "CBC News",
    "TIME",
    "CBS News",
    "The Sun",
    "SputnikNews",
    "ABC News",
    "ABC News",
    "Vox",
    "Sky News",
    "The Sydney Morning Herald",
    "RFI English",
    "News24.com",
    "The Raw Story",
    "Euronews World",
    "Global News",
    "CTV News",
    "FRANCE 24",
    "The Seattle Times",
    "Talking Points Memo",
    "CNA",
    "Daily Telegraph",
    "TODAY",
    "The Christian Science Monitor",
    "PRI Public Radio International",
    "Breaking News",
    "War On The Rocks",
    "Evening Express Memories",
    "New Europe",
    "World Affairs Journal",
    "Small Wars Journal",
    "itworld",
    "Looking Times",
    "Asian Defence News Channel",
    "India Today",
    "Indian Express",
    "The Hindu",
    "News18",
    "FirstPost",
    "Business Standard",
    "DNA India",
    "Deccan Chronicle",
    "Oneindia News",
    "The Financial Express",
    "Scroll",
    "The Hindu Business Line",
    "The Quint",
    "Outlookindia",
    "Free Press Journal",
    "Telangana Today",
    " Asian Age",
    "Chandigarh Metro",
    "Daily Excelsior",
    "Teluguglobal",
    "Jaianndata.com",
    "Star Of Mysore",
    "The Navhind Times",
    "Nagpur Today",
    "The Arunachal Times",
    "The Rising Kashmir",
    "Tentaran.com",
    "Yo Vizag",
    "The Sangai Express",
    "Orissapost",
    "Kashmir Reader",
    "Bilkul Online",
    "Moses News",
    "Emit Post India",
    "THE TIMES OF BENGAL",
    "The Himachal News",
    "the NORTHLINES",
    "The Modern Journal",
    "Election Tamasha",
    "The Metro Talk",
    "League Of India",
    "Indian News Queensland",
    "Politically",
    "Newsekaaina",
    "Sports kanazee",
    "Metro Rail News",
    "Indian Spectator",
    "The Eastern Herald",
    "Asba News"
    

];
function myMain(){
    var posts= document.getElementsByClassName("_5jmm _5pat _3lb4 q_7dw-amam8");
    var totalPost= posts.length;
    console.log(totalPost);
    var postID= new Array(totalPost);
    var postcontent= new Array(totalPost);
    var postTimeDate= new Array(totalPost);
    var pageName= new Array(totalPost);
    var requestSD= new Array(totalPost);
    
    for (let i=0 ;i<totalPost;i++)
    {
        
        postID[i]= posts[i].getAttribute("id");
        if(posts[i].getElementsByClassName("_3ccb")[0]==null) continue;
        let postbox=  posts[i].getElementsByClassName("_5pcr userContentWrapper")[0].getElementsByClassName("_1dwg _1w_m _q7o" )[0];
        let titleTime= postbox.getElementsByClassName("clearfix")[0].getElementsByClassName("_6a _5u5j _6b")[0];
        // .getElementsByClassName("_6a _5u5j _6b")[0];
        pageName[i]= titleTime.getElementsByClassName("fwn fcg")[0].getElementsByTagName("a")[0].innerText;
        //fwb fcg
        if(titleTime.getElementsByClassName("fsm fwn fcg")[0]!= null)
        postTimeDate[i]= titleTime.getElementsByClassName("fsm fwn fcg")[0].getElementsByTagName("a")[0].getElementsByTagName("abbr")[0].getAttribute("title");
        postcontent[i]= postbox.getElementsByClassName("userContent")[0].innerText;
        console.log(pageName[i])
        if(mediaPageList.includes(pageName[i])==true)
        {
            requestSD[i]= new XMLHttpRequest();
            requestSD[i].open("POST", apiURL, true);
            requestSD[i].setRequestHeader("Content-Type", "application/json");
            requestSD[i].onload = function ()
            {
                if(requestSD[i].readyState === XMLHttpRequest.DONE  && requestSD[i].status === 200)
                {
                    var json = JSON.parse(requestSDs[i].responseText);
                    var result=json["prediciton"];
                    if(result=='Disagree')
                    {
                        console.log("fakeNews");
                    }
                } 
            }

        };
        newsCC= JSON.stringify({"queryNews":postcontent[i]});
        // requestSD[i].send(newsCC);  //uncomment when api starts
    }
}
var targetNode=document.getElementById("contentArea");
var config = {childList:true,subtree: true};
var callback = function(mutationsList, observer) {
  myMain();
};
var observer = new MutationObserver(callback);
observer.observe(targetNode, config);