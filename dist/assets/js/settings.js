console.clear();

const toggle = document.querySelectorAll('.toggle');
const fno = document.getElementById('fake-news-opt');
const hso = document.getElementById('hate-speech-opt');
const cbo = document.getElementById('click-baits-opt');
const pwo = document.getElementById('profanity-words-opt');

for(var i = 0; toggle.length > i; i++) {
  toggle[i].addEventListener('click', function() {
    this.classList.toggle('is-on');
    console.log(this.classList);


    if (this.classList.contains('fake-news')){
      fno.classList.toggle('hidden');

    }

    if (this.classList.contains('hate-speech')){
      hso.classList.toggle('hidden');

    }

    if (this.classList.contains('click-baits')){
      cbo.classList.toggle('hidden');

    }

    if (this.classList.contains('profanity-words')){
      pwo.classList.toggle('hidden');

    }

  });
}






//const fn = document.querySelector('#fake-news');
//fn.addEventListener('click', function() {

//if (fn.classList.contains('is-on')) {
//console.log("fdfsf");
   
//}
//	})


