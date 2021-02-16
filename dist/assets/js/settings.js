console.clear();

toggle = document.querySelectorAll('.toggle');
const fno = document.getElementById('fake-news-opt');
const hso = document.getElementById('hate-speech-opt');
const cbo = document.getElementById('click-baits-opt');
const pwo = document.getElementById('profanity-words-opt');
const save_button = document.getElementById('save_settings');


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
  });
}

// function uploadDIIKeys(){
//   var x = document.getElementById("diiKeys");
//   var reader = new FileReader;
//   keys = x.files[0];
//   reader.readAsText(keys);
//   reader.result;

//   chrome.storage.sync.set({"diiKeys": reader.result}, function() {
//     console.log('Value is set to ' + value);
//   });
// }




save_button.addEventListener('click', function () {
  var selected_options = [];
  var toggles = document.querySelectorAll('.toggle');
  for (var i = 0; toggles.length > i; i++) 
  {
    if (toggles[i].classList.contains('is-on')) {
      //console.log('SSS');
      //console.log(toggles[i].classList);
      kk = toggles[i].classList;
      //console.log(kk);
      //console.log(kk[2]);
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

uploadNewsKeys.addEventListener('click', function(){
  console.log('TESET');
  var keys = document.getElementById('newsKeysInput').value;
  chrome.storage.sync.set({'newsKeys' : keys}, function(result){
    console.log('News Keys are set to: ' + keys);
  });
});

showNewsKeys.addEventListener('click', function(){
  chrome.storage.sync.get('newsKeys', function(result){
    console.log('Old News Keys: ' + result.newsKeys);
  });
});

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
  reader.readAsText(keys);
  // reader.result;

  
  // console.log("result")
  console.log(b64Keys);

  // chrome.storage.sync.get('diiKeys', function (result) {
  //   console.log("Old Keys:")
  //   console.log(result.diiKeys)
  // });

  // chrome.storage.sync.set({"diiKeys" : b64Keys}, function() {
  //   console.log('Value is set to ' + b64Keys);
  // });

  // chrome.storage.sync.get('diiKeys', function (result) {
  //   console.log("Old Keys:")
  //   console.log(result.diiKeys)
  // });

});



showKeys.addEventListener('click', function () {
  chrome.storage.sync.get('diiKeys', function (result) {
    console.log('Old Keys:');
    console.log(result);
  });


});
