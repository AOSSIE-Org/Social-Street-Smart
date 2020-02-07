function twitter_clickbait(node) {

  // console.log("in function");
  const images = [...node.getElementsByClassName('css-901oao css-cens5h r-1re7ezh r-1qd0xha r-a023e6 r-16dba41 r-ad9z0x r-bcqeeo r-qvutc0')];

  images.forEach(function (el) {
    var headline_span = el.getElementsByTagName('span');

    var headline = headline_span[0].innerText;
    //console.log("in function");



    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        if (request.status === 200) {
          var data = JSON.parse(request.responseText);
          var clickbait_probability = data.Result;
          var clickbait_label = document.createElement('div');

          if (clickbait_probability > 0.9) {
            clickbait_label.style.textDecoration = 'underline';
            clickbait_label.style.color = 'rgb(128, 0, 0)';
            clickbait_label.style.fontSize = '18px';

            clickbait_label.style.textAlign = 'right';
            clickbait_label.textContent = 'Clickbait';
          } else if ( (clickbait_probability > 0.6) && (clickbait_probability < 0.9) ) {
            clickbait_label.style.textDecoration = 'underline';
            clickbait_label.style.color = 'rgb(' + Number((clickbait_probability) * 1.28).toFixed(0) + ', ' + Number((100 - clickbait_probability) * 1.28).toFixed(0) + ', 0)';
            //console.log(clickbait_banner.style.color);
            clickbait_label.style.textAlign = 'right';
            clickbait_label.style.fontSize = '18px';
            var probability= Math.round(clickbait_probability*100);

            clickbait_label.textContent = (probability) + '% Clickbait';
          }
          var elParent = el.parentNode;
          var parentParent= elParent.parentNode;

	  parentParent.append(clickbait_label);
        //  console.log(clickbait_banner);
        //  console.log(x);
        }
      }
    };

    request.open('GET', 'http://18.221.117.28:7001/pred?text=' + headline, true);
    request.send();
	 																																																																																								
  });

};


function twitter_hatespeech(node) {

  const images = [...node.getElementsByClassName('css-901oao r-hkyrab r-1qd0xha r-a023e6 r-16dba41 r-ad9z0x r-bcqeeo r-bnwqim r-qvutc0')];

  images.forEach(function (el) {
  //  var links = el.getElementsByTagName('a');
    var link = '';
    link = el.textContent;

    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        if (request.status === 200) {
          var data = JSON.parse(request.responseText);
          var toxic_probability = data.Toxic;
          var clickbait_label = document.createElement('div');

          if (toxic_probability > 0.9) {
            clickbait_label.style.textDecoration = 'underline';
            clickbait_label.style.color = 'rgb(128, 0, 0)';
            clickbait_label.style.fontSize = '18px';
            console.log('toxic '+ link); 
	    el.remove();

            clickbait_label.style.textAlign = 'right';
            clickbait_label.textContent = 'TOXIC';
          } else if ( (toxic_probability > 0.6) && (toxic_probability < 0.9) ) {
            clickbait_label.style.textDecoration = 'underline';
            clickbait_label.style.color = 'rgb(' + Number((toxic_probability) * 1.28).toFixed(0) + ', ' + Number((100 - toxic_probability) * 1.28).toFixed(0) + ', 0)';
            //console.log(clickbait_banner.style.color);
            clickbait_label.style.textAlign = 'right';
            clickbait_label.style.fontSize = '18px';
            var probability= Math.round(toxic_probability*100);

            clickbait_label.textContent = (probability) + '% TOXIC';
          }
          var elParent = el.parentNode;
          //var parentParent= elParent.parentNode;

	  elParent.append(clickbait_label);
          //console.log(clickbait_banner);
          //console.log(nodeParent);
        }
      }
    };

    request.open('GET', 'https://sss-hate-speech.herokuapp.com/pred?text=' + link, true);
    request.send();
	 																																																																																								
  });

};

/**

const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    mutation.addedNodes.forEach(function (node) {
      if (node.nodeType === 1) { // ELEMENT_NODE
        facebook_clickbait(node);
      }
    });
  });
});

const config = {																																																																																															
  attributes: false,
  childList: true,
  characterData: false,
  subtree: true
};

observer.observe(document.body, config);
**/
																				
