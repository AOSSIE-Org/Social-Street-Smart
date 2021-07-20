function twitter_clickbait(node,hide=false) {

  // console.log("in function");
  // const images = [...node.getElementsByClassName('css-1dbjc4n r-1bs4hfb r-1867qdf r-1phboty r-rs99b7 r-1ny4l3l r-1udh08x r-o7ynqc r-6416eg')];
  const images = [...node.getElementsByClassName('css-1dbjc4n r-16y2uox r-1wbh5a2 r-z5qs1h r-1777fci r-kzbkwu r-1e081e0 r-ttdzmv')];
  
  images.forEach(function (el) {
    var headline_span = el.getElementsByTagName('span');

    var headline = headline_span[0].innerText;


    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        if (request.status === 200) {
          var data = JSON.parse(request.responseText);
          var clickbait_probability = data.Result;
          var clickbait_label = document.createElement('div');
          clickbait_label.setAttribute('class', 'SSS');

          if (clickbait_probability > 0.9) {
            clickbait_label.style.textDecoration = 'underline';
            clickbait_label.style.color = 'rgb(128, 0, 0)';
            clickbait_label.style.fontSize = '18px';
            clickbait_label.style.textAlign = 'right';
            clickbait_label.textContent = 'Clickbait';

            if(hide){
              rootElement = getParentNode(el,11);
              rootElement.style.display = 'none';
              rootElement.classList.add('SSS-Hide'); // easy for testing
            }

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
          // var parentParent= elParent.parentNode;
          // var parentParent= el.parentNode;

	        elParent.append(clickbait_label);
        //  console.log(clickbait_banner);
        //  console.log(x);
        }
      }
    };

    // request.open('GET', 'http://18.221.117.28:7001/pred?text=' + headline, true);
    request.open('GET', 'https://17u8uun009.execute-api.us-east-1.amazonaws.com/dev/pred?text=' + headline, true);
    request.send();
	 																																																																																								
  });

};


function twitter_hatespeech(node,hide=false) {

  const images = [...node.getElementsByClassName('css-1dbjc4n r-16y2uox r-1wbh5a2 r-z5qs1h r-1777fci r-kzbkwu r-1e081e0 r-ttdzmv')];

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
          clickbait_label.setAttribute('class', 'SSS');
          if (toxic_probability > 0.9) {
            clickbait_label.style.textDecoration = 'underline';
            clickbait_label.style.color = 'rgb(128, 0, 0)';
            clickbait_label.style.fontSize = '18px';
            console.log('toxic '+ link); 
            clickbait_label.style.textAlign = 'right';
            clickbait_label.textContent = 'TOXIC';

            if(hide){
              rootElement = getParentNode(el,11);
              rootElement.style.display = 'none';
              rootElement.classList.add('SSS-Hide'); // easy for testing
            }

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
    // 

    // request.open('GET', 'https://sss-hate-speech.herokuapp.com/pred?text=' + link, true);
    request.open('GET', 'https://wpxmafpmjf.execute-api.us-east-1.amazonaws.com/dev/pred?text=' + link, true);
    request.send();
	 																																																																																								
  });

};

function hideReported_twitter(node) {

  const images = [...node.getElementsByClassName('css-1dbjc4n r-16y2uox r-1wbh5a2 r-z5qs1h r-1777fci r-kzbkwu r-1e081e0 r-ttdzmv')];

  images.forEach(function (el) {
    var link = el.textContent;
    // check if present in reported_fake_news
    if(reported_contents['reported_fake_news'][link] !== undefined){
      rootElement = getParentNode(el,11);
      rootElement.style.display = 'none';
      rootElement.classList.add('SSS-Hide'); // easy for testing
    } // else if present in reported_hate_speech
    else if(reported_contents['reported_hate_speech'][link] !== undefined){
      rootElement = getParentNode(el,11);
      rootElement.style.display = 'none';
      rootElement.classList.add('SSS-Hide'); // easy for testing
    }
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
																				
