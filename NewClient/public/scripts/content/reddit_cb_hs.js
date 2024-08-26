function reddit_clickbait(node, hide = false) {
  console.log("keshav");
  const images = [...node.getElementsByTagName('shreddit-post')];
  console.log(node);
  console.log(images);

  images.forEach(async function (el) {
    const headline = el.innerText;

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
      if (response.ok) {
        const data = await response.json();
        const clickbait_probability = data.Result|| 1; // Assuming this field is available in the actual response
        let clickbait_label = null;

        if (clickbait_probability > 0.9) {
          clickbait_label = document.createElement('div');
          clickbait_label.setAttribute('class', 'SSS');
          clickbait_label.style.textDecoration = 'underline';
          clickbait_label.style.color = 'rgb(128, 0, 0)';
          clickbait_label.style.fontSize = '18px';
          clickbait_label.style.textAlign = 'right';
          clickbait_label.textContent = 'Clickbait';

          // if (hide) {
          //   const rootElement = el;
          //   console.log("reaching");
          //   rootElement.style.display = 'none';
          //   rootElement.classList.add('SSS-Hide'); // easy for testing
          // }
        } else if (clickbait_probability > 0.6 && clickbait_probability < 0.9) {
          clickbait_label = document.createElement('div');
          clickbait_label.setAttribute('class', 'SSS');
          clickbait_label.style.textDecoration = 'underline';
          clickbait_label.style.color = `rgb(${Number((clickbait_probability) * 1.28).toFixed(0)}, ${Number((100 - clickbait_probability) * 1.28).toFixed(0)}, 0)`;
          clickbait_label.style.textAlign = 'right';
          clickbait_label.style.fontSize = '18px';
          const probability = Math.round(clickbait_probability * 100);

          clickbait_label.textContent = `${probability}% Clickbait`;
        }

        if (clickbait_label) {
          console.log(clickbait_label);
          el.appendChild(clickbait_label);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  });
}



async function reddit_hatespeech(node, hide = false) {
  const images = [...node.getElementsByTagName('shreddit-post')];

  images.forEach(async (el) => {
    const link = el.innerText;

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
      if (response.ok) {
        const data = await response.json();
        const toxic_probability = data.Toxic || 1;
        let clickbait_label = null;

        if (toxic_probability > 0.9) {
          clickbait_label = document.createElement('div');
          clickbait_label.style.textDecoration = 'underline';
          clickbait_label.style.color = 'rgb(128, 0, 0)';
          clickbait_label.setAttribute('class', 'SSS');
          clickbait_label.style.fontSize = '18px';
          console.log('toxic ' + link);
          clickbait_label.style.textAlign = 'right';
          clickbait_label.textContent = 'TOXIC';

          // if (hide) {
          //   const rootElement = getParentNode(el, 8);
          //   rootElement.style.display = 'none';
          //   rootElement.classList.add('SSS-Hide');
          // }
        } else if (toxic_probability > 0.6 && toxic_probability < 0.9) {
          clickbait_label = document.createElement('div');
          clickbait_label.style.textDecoration = 'underline';
          clickbait_label.style.color =
            'rgb(' +
            Number(toxic_probability * 1.28).toFixed(0) +
            ', ' +
            Number((100 - toxic_probability) * 1.28).toFixed(0) +
            ', 0)';
          clickbait_label.setAttribute('class', 'SSS');
          clickbait_label.style.textAlign = 'right';
          clickbait_label.style.fontSize = '18px';
          const probability = Math.round(toxic_probability * 100);
          clickbait_label.textContent = probability + '% TOXIC';
        }

        if (clickbait_label) {
          el.appendChild(clickbait_label);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  });
}


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
																				
