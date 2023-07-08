function displayAverageRating(website) {
  
  chrome.storage.sync.get([website], function(result) {
    if(result[website]) {
      let sum = 0;
      let ratingsArray = result[website];

      
      for(let i = 0; i < ratingsArray.length; i++) {
        sum += ratingsArray[i];
      }

      
      let average = sum / ratingsArray.length;

      
      document.getElementById('averageRating').innerText = 'Average Rating: ' + average.toFixed(2);
    }
  });
}

function fetchGpt3Response(e) {
  e.preventDefault();

  const apiKey = localStorage.getItem('apiKey');
  const inputText = document.getElementById('textarea').value;

  fetch('http://localhost:5000/generate', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      'api_key': apiKey,
      'prompt': inputText 
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error occurred');
      }
      return response.json();
    })
    .then(data => {
      const resultSpan = document.getElementById('resultSpan');
      resultSpan.textContent = data.response; 
    })
    .catch(error => {
      const resultSpan = document.getElementById('resultSpan');
      resultSpan.textContent = 'Error: ' + error.message;
    });
}




window.onload = function() {

  document.getElementById('ContextAnalysis_button').addEventListener('click', fetchGpt3Response);

  let ratingInputs = document.getElementsByName('rating');
  for(let i = 0; i < ratingInputs.length; i++) {
    ratingInputs[i].addEventListener('change', function() {
      let newRating = parseInt(this.value);
      
      chrome.storage.sync.get([curWebsite], function(result) {
        let ratingsArray;
        if(result[curWebsite]) {
          ratingsArray = result[curWebsite];
        } else {
          
          ratingsArray = [];
        }
        
        ratingsArray.push(newRating);
        
        let saveObj = {};
        saveObj[curWebsite] = ratingsArray;
        chrome.storage.sync.set(saveObj, function() {
          
          displayAverageRating(curWebsite);
        });
      });
    });
  }

  

  chrome.storage.sync.get(['Main_Switch, white_list'], function(result){

    console.log(result.white_list);

    if((result.white_list)==='undefined') {
      chrome.storage.sync.set({'white_list': '|stackoverflow.com'});
    }
    
    if((result.Main_Switch)==='undefined') {
      chrome.storage.sync.set({'Main_Switch': 'yes'});
    }
    
  });


  var curWebsite='';

  function setWebsite(website){
    curWebsite=website;
  }
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var r = /:\/\/(.[^/]+)/;
    k=tabs[0].url.match(r)[1];
    myWebsite=k.replace(/^(https?:\/\/)?(www\.)?/,'');
    setWebsite(myWebsite);
  });
  
  
  chrome.storage.sync.get(['Main_Switch'], function(result) {
    var onOff = document.getElementById('mainonoffswitch');

    if(result.Main_Switch==='yes'){
      if (!((onOff.classList).contains('is_on'))) {
        onOff.classList.add('is_on');
        onOff.checked = true;
      }
    }
    //console.log(result.Main_Switch+'yo');

    if(result.Main_Switch==='no'){
      if ((onOff.classList).contains('is_on')) {
        onOff.classList.remove('is_on');
        onOff.checked = false;
      }
    }
  }
  );


  chrome.storage.sync.get(['white_list'], function(result) {
  
    if(result.white_list){
      //console.log('wl'+ result.white_list);

      var onOff = document.getElementById('whitelistSwitch');
      console.log(result.white_list);    
      console.log(curWebsite);
      if((result.white_list).includes('|'+curWebsite)){
        if (!((onOff.classList).contains('is_on'))) {
          onOff.classList.add('is_on');
          onOff.checked = true;
        }

      }

      if((!(result.white_list).includes('|'+curWebsite))){
        if ((onOff.classList).contains('is_on')) {
          onOff.classList.remove('is_on');
          onOff.checked = false;
        }
      }

    }
  }
  );



  var onOff = document.getElementById('mainonoffswitch');
  //console.log(onOff);

  onOff.addEventListener('click', function () {
    var flag;
    if(this.classList.contains('is_on')){
      this.classList.remove('is_on');
      chrome.storage.sync.set({'Main_Switch': 'no'});
      chrome.storage.sync.get(['Main_Switch'], function(result) {
        // console.log(result.Main_Switch);
      });

      flag=1;
    }

    if(!(this.classList.contains('is_on'))&&(flag!==1)){
      this.classList.add('is_on');
      chrome.storage.sync.set({'Main_Switch': 'yes'});
      chrome.storage.sync.get(['Main_Switch'], function(result) {
        //console.log(result.Main_Switch);
      });     
    }

  });


  var whiteList = document.getElementById('whitelistSwitch');
  whiteList.addEventListener('click', function () {
    if(this.classList.contains('is_on')){
      this.classList.remove('is_on');
      chrome.storage.sync.get(['white_list'], function(result) {
        var websiteList = result.white_list;
        websiteList = websiteList.replace('|' + curWebsite, '');
        console.log(websiteList+'after removal');
        chrome.storage.sync.set({'white_list': websiteList});
      }
      );}


    else
    {
      this.classList.add('is_on');
      chrome.storage.sync.get(['white_list'], function(result) {
        // console.log(curWebsite);
        var websiteList= '';
        websiteList=websiteList+result.white_list;
        if(websiteList){
          websiteList=websiteList+'|'+curWebsite;
          console.log(websiteList);
        }

        else {
          console.log(curWebsite);
          websiteList=websiteList+curWebsite;
          console.log(websiteList);
        }

        chrome.storage.sync.set({'white_list': websiteList});
      });
    }
  });



      
};

NewsOrigin_button.addEventListener('click', function(){
  text = document.getElementById('textarea').value;
  res = document.getElementById('resultSpan');
  
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      //console.log("received" + clickData.selectionText);
      var data = JSON.parse(xhttp.responseText);
      var info_high = data['HIGH'];
      var info_some = data['SOME'];
      var info_minimal = data['MINIMAL'];

      var notific = 'Origin Probabilities:\n';
      notific = notific + 'HIGH: ' + info_high +  '\n'; 
      notific = notific + 'SOME: ' + info_some + '\n'; 
      notific = notific + 'MINIMAL: ' + info_minimal +  '\n'; 
        
      console.log(info_high);
      // res.innerText = JSON.stringify(notific);
      res.innerText = notific;
    }
    else{
      res.innerText = 'There was an error.';
    }
  };

        
  chrome.storage.sync.get('newsKeys', function (result) {
    console.log('Old Keys:');
    console.log(result);
    newsKeys = result.newsKeys;

  });
  xhttp.open('GET', 'https://phcg4hgf84.execute-api.us-east-1.amazonaws.com/dev/pred?text=' + text + '&key=' + newsKeys, true);
  // xhttp.open('GET', 'http://127.0.0.1:5000/pred?text=' + clickData.selectionText + "&key=" + newsKeys, true);
  xhttp.send();

});


