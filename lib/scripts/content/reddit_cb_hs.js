function reddit_clickbait(node) {
  // console.log('reddit cb function called')
  // console.log("in function");
  // const images = [...node.getElementsByClassName('Post _2SdHzo12ISmrC8H86TgSCp _29WrubtjAcKqzJSPdQqQ4h _eYtD2XCVieq6emjKBH3m')];
  const images = [...node.getElementsByClassName('_eYtD2XCVieq6emjKBH3m')];
  // console.log(images);
  
  //   console.log("in function");
  
    
  Array.prototype.forEach.call(images, function(el) {
  

    // var headline = el.getElementsByTagName('h3')[0].innerText;
    console.log(el.innerText);
    var headline = el.innerText;
    
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        if (request.status === 200) {
          var data = JSON.parse(request.responseText);
          var clickbait_probability = data.Result;
          clickbait_label=0;
          if (clickbait_probability > 0.9) {
            var clickbait_label = document.createElement('div');
            clickbait_label.setAttribute('class', 'SSS');
            clickbait_label.style.textDecoration = 'underline';
            clickbait_label.style.color = 'rgb(128, 0, 0)';
            clickbait_label.style.fontSize = '18px';

            clickbait_label.style.textAlign = 'right';
            clickbait_label.textContent = 'Clickbait';
          } else if ( (clickbait_probability > 0.6) && (clickbait_probability < 0.9) ) {
            var clickbait_label = document.createElement('div');
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
	  // elChild.append(clickbait_label);
        //  console.log(clickbait_banner);
        //  console.log(x);
        }
      }
    };

    request.open('GET', 'https://17u8uun009.execute-api.us-east-1.amazonaws.com/dev/pred?text=' + headline, true);
    request.send();
	 																																																																																								
  });

};


function reddit_hatespeech(node) {

  const images = [...node.getElementsByClassName('_1poyrkZ7g36PawDueRza-J _11R7M_VOgKO1RJyRSRErT3 _2SdHzo12ISmrC8H86TgSCp _3wqmjmv3tb_k-PROt7qFZe  _eYtD2XCVieq6emjKBH3m Chtkt3BCZQruf0LtmFg2c')];

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
          var elChild = el.childNodes[1];

	  elChild.append(clickbait_label);
	  elChild.append(clickbait_label);
          //console.log(clickbait_banner);
          //console.log(nodeParent);
        }
      }
    };

    request.open('GET', 'https://wpxmafpmjf.execute-api.us-east-1.amazonaws.com/dev/pred?text=' + link, true);
    request.send();
	 																																																																																								
  });

};

																				
