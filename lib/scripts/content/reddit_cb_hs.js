function reddit_clickbait(node,hide=false) {
  const images = [...node.getElementsByClassName('_eYtD2XCVieq6emjKBH3m')];
    
  Array.prototype.forEach.call(images, function(el) {
  
    var headline = el.innerText;
    
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        if (request.status === 200) {
          var data = JSON.parse(request.responseText);
          var clickbait_probability = data.Result;
          var clickbait_label=0;
          if (clickbait_probability > 0.9) {
            clickbait_label = document.createElement('div');
            clickbait_label.setAttribute('class', 'SSS');
            clickbait_label.style.textDecoration = 'underline';
            clickbait_label.style.color = 'rgb(128, 0, 0)';
            clickbait_label.style.fontSize = '18px';
            clickbait_label.style.textAlign = 'right';
            clickbait_label.textContent = 'Clickbait';

            if(hide){ // set display none
              rootElement = getParentNode(el,8);
              rootElement.style.display = 'none';
              rootElement.classList.add('SSS-Hide'); // easy for testing
            }

          } else if ( (clickbait_probability > 0.6) && (clickbait_probability < 0.9) ) {
            clickbait_label = document.createElement('div');
            clickbait_label.setAttribute('class', 'SSS');
            clickbait_label.style.textDecoration = 'underline';
            clickbait_label.style.color = 'rgb(' + Number((clickbait_probability) * 1.28).toFixed(0) + ', ' + Number((100 - clickbait_probability) * 1.28).toFixed(0) + ', 0)';
            //console.log(clickbait_banner.style.color);
            clickbait_label.style.textAlign = 'right';
            clickbait_label.style.fontSize = '18px';
            var probability= Math.round(clickbait_probability*100);

            clickbait_label.textContent = (probability) + '% Clickbait';
          
          }
          var elChild = el.childNodes[1];
          if(clickbait_label){
            console.log(clickbait_label);
            el.appendChild(clickbait_label);
          }

        }
      }
    };

    request.open('GET', 'https://17u8uun009.execute-api.us-east-1.amazonaws.com/dev/pred?text=' + headline, true);
    request.send();
	 																																																																																								
  });

};


function reddit_hatespeech(node,hide=false) {

  const images = [...node.getElementsByClassName('_eYtD2XCVieq6emjKBH3m')];

  Array.prototype.forEach.call(images, function(el) {
  
    var link = el.innerText;


    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        if (request.status === 200) {
          var data = JSON.parse(request.responseText);
          var toxic_probability = data.Toxic;
		  var clickbait_label = 0;
          if (toxic_probability > 0.9) {
            clickbait_label = document.createElement('div');
            clickbait_label.style.textDecoration = 'underline';
            clickbait_label.style.color = 'rgb(128, 0, 0)';
            clickbait_label.setAttribute('class', 'SSS');
            clickbait_label.style.fontSize = '18px';
            console.log('toxic '+ link); 
            clickbait_label.style.textAlign = 'right';
            clickbait_label.textContent = 'TOXIC';

            if(hide){ // set display none
              rootElement = getParentNode(el,8);
              rootElement.style.display = 'none';
              rootElement.classList.add('SSS-Hide'); // easy for testing
            }

          } else if ( (toxic_probability > 0.6) && (toxic_probability < 0.9) ) {
            clickbait_label = document.createElement('div');
            clickbait_label.style.textDecoration = 'underline';
            clickbait_label.style.color = 'rgb(' + Number((toxic_probability) * 1.28).toFixed(0) + ', ' + Number((100 - toxic_probability) * 1.28).toFixed(0) + ', 0)';
            //console.log(clickbait_banner.style.color);
            clickbait_label.setAttribute('class', 'SSS');
            clickbait_label.style.textAlign = 'right';
            clickbait_label.style.fontSize = '18px';
            var probability= Math.round(toxic_probability*100);

            clickbait_label.textContent = (probability) + '% TOXIC';
          }
          var elChild = el.childNodes[1];

          if(clickbait_label){
            el.appendChild(clickbait_label);
          }
		
        }
      }
    };

    request.open('GET', 'https://wpxmafpmjf.execute-api.us-east-1.amazonaws.com/dev/pred?text=' + link, true);
    request.send();
	 																																																																																								
  });

};

function hideReported_reddit(node) {

  const images = [...node.getElementsByClassName('_eYtD2XCVieq6emjKBH3m')];
  
  images.forEach(function (el) {
    var link = el.textContent;
    // check if present in reported_fake_news
    if(reported_contents.reported_fake_news[link] !== undefined){
      rootElement = getParentNode(el,8);
      rootElement.style.display = 'none';
      rootElement.classList.add('SSS-Hide'); // easy for testing
    } // else if present in reported_hate_speech
    else if(reported_contents.reported_hate_speech[link] !== undefined){
      rootElement = getParentNode(el,8);
      rootElement.style.display = 'none';
      rootElement.classList.add('SSS-Hide'); // easy for testing
    }
  });
};
																				
