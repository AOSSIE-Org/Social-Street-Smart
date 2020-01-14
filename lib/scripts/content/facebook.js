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
function myMain(node){
    // console.log(node, "from main");
    var postID= null;
    var postcontent= null;
    var postTimeDate= null;
    var pageName= null;
    var requestSD= null;
        
    if(node.getElementsByClassName("_3ccb")[0]==null) {
        // console.log("3cb not found");
        return;}

    let postbox=  node.getElementsByClassName("_5pcr userContentWrapper")[0].getElementsByClassName("_1dwg _1w_m _q7o" )[0];
    let titleTime= postbox.getElementsByClassName("clearfix")[0].getElementsByClassName("_6a _5u5j _6b")[0];
    // .getElementsByClassName("_6a _5u5j _6b")[0];
    pageName= titleTime.getElementsByClassName("fwn fcg")[0].getElementsByTagName("a")[0].innerText;
    //fwb fcg
    if(titleTime.getElementsByClassName("fsm fwn fcg")[0]!= null)
    postID= titleTime.getElementsByClassName("fsm fwn fcg")[0].getElementsByTagName("a")[0].getAttribute("href");
    postTimeDate=  titleTime.getElementsByClassName("fsm fwn fcg")[0].getElementsByTagName("a")[0].innerText;
    postcontent= postbox.getElementsByClassName("userContent")[0].innerText;
    // console.log(pageName)
    // console.log(postcontent)
    if(mediaPageList.includes(pageName)==true)
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
                var resultNode= postbox.getElementsByClassName("userContent")[0];
                resultNode.append(resultDiv);
            } 
        }
        newsCC= JSON.stringify(
            {
                "source":"FB",
                "body":{
                    "fbID": postID,
                    "sourcePage": pageName,
                    "dateTime": postTimeDate,
                    "content": postcontent
                }
            }
        );
        requestSD.send(newsCC);
    };

}
var targetNode=document.getElementsByClassName("_5pcb _dp7 _4j3f")[0].childNodes[1].childNodes[2].childNodes[0];
var config = {childList:true,subtree: true};
var callback = function(mutationsList, observer) {
    mutationsList.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
            if(node.nodeType==1){
                if(node.className==="_4-u2 mbm _4mrt _5v3q _7cqq _4-u8")
                {

                    myMain(node);
                }
            };

        });
    });
};
var observer = new MutationObserver(callback);
observer.observe(targetNode, config);

