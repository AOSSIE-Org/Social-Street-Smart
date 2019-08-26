
function youtube_clickbait(node) {

  const images = document.querySelectorAll('[id=video-title]');

  images.forEach(function (el) {
    //var headline_span = el.getElementsByTagName('span');
    if (el.id !== 'SSS-Youtube'){
      var headline = el.innerText;
      console.log(headline);



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
          //console.log(clickbait_banner);
          //console.log(nodeParent);
          }
        }
      };

      request.open('GET', 'https://sss-clickbait.herokuapp.com/pred?text=' + headline, true);
      request.send();

    }

    el.id = 'SSS-Youtube';
	 																																																																																								
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
																				
