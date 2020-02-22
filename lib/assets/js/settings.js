console.clear();

toggle = document.querySelectorAll('.toggle');
const fno = document.getElementById('fake-news-opt');
const hso = document.getElementById('hate-speech-opt');
const cbo = document.getElementById('click-baits-opt');
const pwo = document.getElementById('profanity-words-opt');
const save_button = document.getElementById('save_settings');
const reset_button=document.getElementById('reset');


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


save_button.addEventListener('click', function () {
  var selected_options = [];
  var is_selected = document.querySelectorAll('.is-on');
  is_selected.forEach((ele)=>{
    selected_options.push(ele.classList[2]);
  });

  chrome.storage.sync.set({ options: selected_options }, function () {
    console.log('Options: ' + selected_options);
  });
});

reset_button.addEventListener('click',function(){
  document.querySelectorAll('.is-on').forEach(ele=>ele.classList.toggle('is-on'));
  if(fno.classList.contains('hidden'))
    fno.classList.toggle('hidden');
  if(pwo.classList.contains('hidden'))
    pwo.classList.toggle('hidden');
  if(hso.classList.contains('hidden'))
    hso.classList.toggle('hidden');
  if(cbo.classList.contains('hidden'))
    cbo.classList.toggle('hidden');
  chrome.storage.sync.set({ options: []}, function () { 
  });
});
