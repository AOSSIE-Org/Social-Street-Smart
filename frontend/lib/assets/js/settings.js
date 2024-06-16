console.clear();

toggle = document.querySelectorAll('.toggle');
const fno = document.getElementById('fake-news-opt');
const hso = document.getElementById('hate-speech-opt');
const cbo = document.getElementById('click-baits-opt');
const pwo = document.getElementById('profanity-words-opt');

// +++++++++ Select hide flagged opt ++++++++++

const hfo = document.getElementById('hide-flagged-opt');

// ++++++++++++++++

const reset_flagged = document.getElementById('reset_flagged');

// +++++++++++++++++

const save_button = document.getElementById('save_settings');
const warn_dii    = document.getElementById('warning_dii');
const warn_orig   = document.getElementById('warning_norig');

chrome.storage.sync.get(['white_list'], function(result) {
  if(result.white_list){
    var whiteList = (result.white_list).split('|');
    for(var i=0; i<whiteList.length;i++){
      if(whiteList[i] !== 'undefined'){
        var node = document.createElement('LI');                 // Create a <li> node
        var textnode = document.createTextNode(whiteList[i]); 
        node.className = 'list-group-item';
        node.appendChild(textnode);                              // Append the text to <li>
        document.getElementById('ul_whitelist').appendChild(node);
      }   
    }
  }
}
);

chrome.storage.sync.get(['options'], function (result) {
  console.log(result.options);
  if (typeof result.options === 'undefined') {

  }

  else {
    for (var i = 0; i < ((result.options).length); i++) {
      var n = '.' + ((result.options)[i]);
      console.log(n);
      var find_element = document.querySelectorAll(n);
      //console.log(find_element);

      if (find_element[0].classList.contains('disable_fake_news')) {
        fno.classList.add('hidden');
      }

      if (find_element[0].classList.contains('disable_hate_speech')) {
        hso.classList.add('hidden');
      }

      if (find_element[0].classList.contains('disable_click_baits')) {
        cbo.classList.add('hidden');
      }

      if (find_element[0].classList.contains('disable_profanity_words')) {
        pwo.classList.add('hidden');
      }

      // ++++++ added hidden class for disable_hide_flagged ++++++

      if (find_element[0].classList.contains('disable_hide_contents')) {
        hfo.classList.add('hidden');
      }

      // 

      find_element[0].classList.add('is-on');

    }
  }
}
);



for (var i = 0; toggle.length > i; i++) {
  toggle[i].addEventListener('click', function () {
    this.classList.toggle('is-on');
    if (this.classList.contains('disable_fake_news')) {
      fno.classList.toggle('hidden');
    }

    if (this.classList.contains('disable_hate_speech')) {
      hso.classList.toggle('hidden');
    }

    if (this.classList.contains('disable_click_baits')) {
      cbo.classList.toggle('hidden');
    }

    if (this.classList.contains('disable_profanity_words')) {
      pwo.classList.toggle('hidden');
    }

    if (this.classList.contains('disable_hide_contents')) {
      hfo.classList.toggle('hidden');
    }

  });
}


save_button.addEventListener('click', function () {
  var selected_options = [];
  var toggles = document.querySelectorAll('.toggle');
  for (var i = 0; toggles.length > i; i++) 
  {
    if (toggles[i].classList.contains('is-on')) {
      kk = toggles[i].classList;
      selected_options.push(kk[2]);
    }
  }

  var temp={};
  temp['options']=selected_options;
  
  chrome.storage.sync.set(temp, function () {
    console.log('Options: ' + selected_options);
  });

  chrome.storage.sync.get(['options'], function (result) {
    console.log(result.options);
  });

  close();


});


// ++++++++++ add reset functionality +++++++++++

reset_flagged.addEventListener('click', function () {
  
  temp = {};
  temp['reported_contents'] = {
    'reported_fake_news' : {},
    'reported_hate_speech' : {}
  };

  chrome.storage.sync.set(temp, function () {
    console.log(temp);
  });

});

// ++++++++++++

// News Origin

window.onload = function() {
  document.getElementById('uploadOpenAIKeys').addEventListener('click', function(event) {
    event.preventDefault();
    var apiKey = document.getElementById('OpenAIKeysInput').value;
    localStorage.setItem('apiKey', apiKey);
  });
};

uploadNewsKeys.addEventListener('click', function(){
  console.log('TESET');
  var keys = document.getElementById('newsKeysInput').value;
  if(keys != ''){ // save only if key is valid( not an empty string)
    chrome.storage.sync.set({'newsKeys' : keys}, function(result){
      console.log('News Keys are set to: ' + keys);
    });

    warn_orig.innerText = 'Saved Successfully !!';
  }
  else{
    warn_orig.innerText = 'Please enter the API key first !!';
  }

});

showNewsKeys.addEventListener('click', function(){
  chrome.storage.sync.get('newsKeys', function(result){
    if(result.newsKeys){ // when keys are found
      console.log('Old News Keys: ' + result.newsKeys);
      warn_orig.innerText = ''; 
    }
    else{ // when keys are not found
      console.log('No keys found !!');  
      warn_orig.innerText = 'No keys found !!';
    }
  });

});

// DII 

uploadDIIKeys.addEventListener('click', function () {
  
  var x = document.getElementById('diiKeys');
  var reader = new FileReader;
  var b64Keys = '';
  keys = x.files[0];
  reader.onload = function(e) {
    console.log(e.target.result);
    var b64Keys = btoa(e.target.result);
    chrome.storage.sync.set({'diiKeys' : b64Keys}, function() {
      console.log('Value is set to ' + b64Keys);
    });
    
  };
  reader.onerror = function(stuff) {
    console.log('error', stuff);
    console.log (stuff.getMessage());
  };

  if(keys){
    warn_dii.innerText = 'Saved Successfully !!';
    reader.readAsText(keys);
       
  }
  else{
    warn_dii.innerText = 'Please choose a file !!';
  }
});



showKeys.addEventListener('click', function () {
  chrome.storage.sync.get('diiKeys', function (result) {
    // typeof(result) = Object, if empty return "No Keys found" 
    if(Object.keys(result).length != 0){ 
      console.log('Old Keys:');
      console.log(result); 
      warn_dii.innerText = ''; 
    }
    else{ // when keys are not found
      console.log('No keys found !!');  
      warn_dii.innerText = 'No keys found !!';
    }
  });
});
