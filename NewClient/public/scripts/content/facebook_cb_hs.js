console.log("fb_cb_hs.js");
function facebook_clickbait(node, hide=true) {
  console.log("facebook_clickbait")
  const class1 = 'x9f619 x1n2onr6 x1ja2u2z x1jx94hy x1qpq9i9 xdney7k xu5ydu1 xt3gfkd xh8yej3 x6ikm8r x10wlt62 xquyuld'; // when signed in
  const class2 = 'mbs _6m6 _2cnj _5s6c';  // when signed out
  const images = [...node.getElementsByClassName(class1)].concat([...node.getElementsByClassName(class2)]);
  console.log(images);
  
  images.forEach(function (el) {
    var link = el.textContent;

    fetch('https://jsonplaceholder.typicode.com/posts/1')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        // For demo purposes, assuming data.Result comes from the actual API.
        var clickbait_probability = data.Result || 1; // Defaulting to 1 for this example.
        var clickbait_label = document.createElement('div');
        clickbait_label.setAttribute('class', 'SSS');

        if (clickbait_probability > 0.9) {
          clickbait_label.style.textDecoration = 'underline';
          clickbait_label.style.color = 'rgb(128, 0, 0)';
          clickbait_label.style.fontSize = '18px';
          clickbait_label.style.textAlign = 'right';
          clickbait_label.textContent = 'Clickbait';

          // if(hide){ // set display none
          //   let rootElement;
          //   if([...node.getElementsByClassName(class1)].length > 0) {
          //     rootElement = getParentNode(el, 20);
          //   } else {
          //     rootElement = getParentNode(el, 17); // when logged out
          //   }
          //   rootElement.style.display = 'none';
          //   rootElement.classList.add('SSS-Hide'); // easy for testing
          // }
        } else if (clickbait_probability > 0.6 && clickbait_probability < 0.9) {
          clickbait_label.style.textDecoration = 'underline';
          clickbait_label.style.color = `rgb(${Number((clickbait_probability) * 1.28).toFixed(0)}, ${Number((100 - clickbait_probability) * 1.28).toFixed(0)}, 0)`;
          clickbait_label.style.textAlign = 'right';
          clickbait_label.style.fontSize = '18px';
          var probability = Math.round(clickbait_probability * 100);
          clickbait_label.textContent = `${probability}% Clickbait`;
        }

        var elParent = el.parentNode;
        var parentParent = elParent.parentNode;
        parentParent.append(clickbait_label);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  });
}


function facebook_hatespeech(node,hide=false) {

  const class1 = 'enqfppq2 muag1w35 ni8dbmo4 stjgntxs e5nlhep0 ecm0bbzt rq0escxv a5q79mjw r9c01rrb'; // when signed in
  const class2 = 'mbs _6m6 _2cnj _5s6c';  // when signed out
  const images = [...node.getElementsByClassName(class1)].concat([...node.getElementsByClassName(class2)]);
  
  images.forEach(function (el) {

    var link = el.textContent;

    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        if (request.status === 200) {
          var data = JSON.parse(request.responseText);
          var toxic_probability = data.Toxic;
          var clickbait_label = document.createElement('div');
          clickbait_label.setAttribute('class', 'SSS'); // added attributes

          if (toxic_probability > 0.9) {
            clickbait_label.style.textDecoration = 'underline';
            clickbait_label.style.color = 'rgb(128, 0, 0)';
            clickbait_label.style.fontSize = '18px';
            console.log('toxic '+ link); 
            clickbait_label.style.textAlign = 'right';
            clickbait_label.textContent = 'TOXIC';

            if(hide){ // set display none
              if([...node.getElementsByClassName(class1)].length >0 ){
                rootElement = getParentNode(el,20);
              }
              else{
                rootElement = getParentNode(el,17); // when logged out
              }
              rootElement.style.display = 'none';
              rootElement.classList.add('SSS-Hide'); // easy for testing

            }

          } else if ( (toxic_probability > 0.6) && (toxic_probability < 0.9) ) {
            clickbait_label.style.textDecoration = 'underline';
            clickbait_label.style.color = 'rgb(' + Number((toxic_probability) * 1.28).toFixed(0) + ', ' + Number((100 - toxic_probability) * 1.28).toFixed(0) + ', 0)';
           
            clickbait_label.style.textAlign = 'right';
            clickbait_label.style.fontSize = '18px';
            var probability= Math.round(toxic_probability*100);

            clickbait_label.textContent = (probability) + '% TOXIC';
          }
          var elParent = el.parentNode;
          var parentParent= elParent.parentNode.parentNode;

	        parentParent.append(clickbait_label);

        }
      }
    };
    
    request.open('GET', 'https://wpxmafpmjf.execute-api.us-east-1.amazonaws.com/dev/pred?text=' + link, true);
    request.send();
	 																																																																																								
  });

};


function hideReported_facebook(node) {
  const class1 = 'enqfppq2 muag1w35 ni8dbmo4 stjgntxs e5nlhep0 ecm0bbzt rq0escxv a5q79mjw r9c01rrb'; // when signed in
  const class2 = 'mbs _6m6 _2cnj _5s6c';  // when signed out
  const images = [...node.getElementsByClassName(class1)].concat([...node.getElementsByClassName(class2)]);
  
  images.forEach(function (el) {
    var link = el.textContent;
    // check if present in reported_fake_news
    if(reported_contents.reported_fake_news[link] !== undefined){

      if([...node.getElementsByClassName(class1)].length >0 ){
        rootElement = getParentNode(el,20);
      }
      else{
        rootElement = getParentNode(el,17); // when logged out
      }
      rootElement.style.display = 'none';
      rootElement.classList.add('SSS-Hide'); // easy for testing

    } // else if present in reported_hate_speech
    else if(reported_contents.reported_hate_speech[link] !== undefined){

      if([...node.getElementsByClassName(class1)].length >0 ){
        rootElement = getParentNode(el,20);
      }
      else{
        rootElement = getParentNode(el,17); // when logged out
      }
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


																				
