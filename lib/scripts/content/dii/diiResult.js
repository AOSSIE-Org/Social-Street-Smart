// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
//     console.log("test");
//     switch (request.type){
//         case "openModal":
//             $('#myModal').modal({
//                backdrop: 'static',
//                keyboard: false
//             });
//             break;  
// }});
// console.log("test")
// var iframe = document.createElement('iframe');
// iframe.src = chrome.extension.getURL("scripts/content/modal/modal.html");
// iframe.frameBorder = 0;
// iframe.id = "myFrame";
// $(iframe).hide();//necessary otherwise frame will be visible
// $(iframe).appendTo("body");


// $(window).on('load',function(){
//     $('#exampleModalLong').modal('show');
//   });
	
var getParams = function (url) {
  var params = {};
  var parser = document.createElement('a');
  parser.href = url;
  var query = parser.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    params[pair[0]] = decodeURIComponent(pair[1]);
  }
  return params;
};
	
var p = getParams(window.location.href);
	

if(p['api'] === 'fn'){
  console.log(123);
  var src =  atob(p['src']);
  var body = document.getElementsByTagName('body')[0];
  //   body.append(p["a"])
  var res = JSON.parse(atob(p['result']));
  // var res = atob(p['result']);
  // var para = document.createElement('p');
  // para.class = 'lead text-center';
  // var h5 = document.createElement('h5');
  // h5.innerText = 'Possible instances of this image are';
  // para.append(h5);
  // body.append(para);

  title = document.getElementsByClassName('card-header')[0];
  title.innerText = 'Prediction for ' + src;
	
  var resultList = document.getElementById('resultList');
  var li = document.createElement('li');
  li.className = 'list-group-item';
  var btn = document.createElement('p');
  if(res['prediciton'] == 'genuine'){
    btn.className = 'text-success font-weight-bold';
    // btn.type = "button"
    btn.innerText = 'Genuine';
  }
  else if(res['prediciton'] == 'fake'){
    btn.className = 'text-danger font-weight-bold';
    // btn.type = "button"
    btn.innerText = 'Fake';
  }
  else{
    btn.className = 'text-warning font-weight-bold';
    btn.type = 'button';
    btn.innerText = 'Sorry, we were unable to make a prediction about this';
  }
  li.append(btn);
  resultList.append(li);
}
else if(p['api'] === 'dii'){
  var img = document.getElementById('lookupImg');
  img.src = atob(p['imgsrc']);
  // img.class = 'img-thumbnail rounded mx-auto d-block';
  // img.style = "height:22em"
  // resultDiv.append(img)

  var res = JSON.parse(atob(p['result']));

  var para = document.createElement('p');
  para.class = 'lead text-center';

  var resultList = document.getElementById('resultList');

  var h5 = document.createElement('h5');
  h5.innerText = 'Possible instances of this image are';
  para.append(h5);
  for(var i = 0; i < res.length; i++){
    var li = document.createElement('li');
    var el = document.createElement('a');
    el.href = res[i]['url'];
    el.innerHTML = res[i]['title'] + '<br>';
    li.className = 'list-group-item';
    btn = document.createElement('p');
    if(res[i]['fact'] == 'HIGH'){
      btn.className = 'text-success font-weight-bold';
      // btn.type = "button"
      btn.innerText = 'High Factual Reliability';
    }
    else if(res[i]['fact'] == 'MIXED'){
      btn.className = 'text-info font-weight-bold';
      btn.type = 'button';
      btn.innerText = 'Medium Factual Reliability';
    }
    else if(res[i]['fact'] == 'HIGH'){
      btn.className = 'text-danger font-weight-bold';
      btn.type = 'button';
      btn.innerText = 'Low Factual Reliability';
    }
    else{
      btn.className = 'text-warning font-weight-bold';
      btn.type = 'button';
      btn.innerText = 'Factual Reliability Data Unavailable';
    }
    // li.insertAdjacentText = ""
    // li.classList =
    li.append(el);
    li.append(btn);
    resultList.append(li);
    // para.append(br);
  }
}
else if(p['api'] === 'fc'){
  console.log('fc goes here');
  var searchText =  atob(p['searchText']);
  var body = document.getElementsByTagName('body')[0];
  var res = JSON.parse(decodeURIComponent(escape(window.atob(p['src']))));
  let claims = res.claims;

  title = document.getElementsByClassName('card-header')[0];
  title.innerText = 'Searched Text: ' + searchText;
	
  var resultList = document.getElementById('resultList');

  for(let i = 0; i < claims.length ; i++ ){

    let containerList = document.createElement('li');
    containerList.className = 'list-group-item';

    let claimTextLi = document.createElement('li');
    claimTextLi.className = 'list-group-item';

    let topdiv = document.createElement('div');
    let text = document.createElement('div');
    text.className = 'h4 font-weight-bold';
    let claimant = document.createElement('div');
    claimant.className = 'mb-2';

    text.innerText = claims[i]['text'];
    claimant.innerText = 'Claimant: ' + claims[i]['claimant'];

    topdiv.append(text);
    topdiv.append(claimant);

    // related Articles
    let relatedADiv = document.createElement('div');
    relatedADiv.className = 'text-left border p-3';
    let relatedASpan = document.createElement('span');
    relatedASpan.className = 'h5 font-weight-bold';
    relatedASpan.innerText = 'Related Articles';

    let relatedAContainer = document.createElement('ul');
    relatedAContainer.id = 'related_articles_' + i ;    
    relatedAContainer.className = 'list-group list-group-flush';

    claimReviews =  claims[i].claimReview;
    
    // if multiple claimReviews are present
    for(let j = 0 ; j < claimReviews.length ; j++ ){

      let relatedAChild = document.createElement('li');
      relatedAChild.className = 'list-group-item';

      let titleDiv = document.createElement('div');
      titleDiv.className = 'h5 text-center pb-2';
      titleDiv.innerText = claimReviews[j]['title'];

      let claimDetails = document.createElement('div');
      claimDetails.className = 'row d-flex align-items-center justify-content-between mx-2';

      let claimDetailsRating = document.createElement('div');
      claimDetailsRating.className = 'font-weight-bold';
      claimDetailsRating.innerText = 'Rating: ';
      let ratingSpan = document.createElement('span');
      ratingSpan.className = 'text-uppercase';
      ratingSpan.innerText = claimReviews[j]['textualRating'];
      claimDetailsRating.append(ratingSpan);

      let claimViewBtn = document.createElement('button');
      claimViewBtn.className = 'float-right btn btn-info';

      let el = document.createElement('a');
      el.href = claimReviews[j]['url'];
      el.className = 'text-white text-decoration-none';
      el.target = '_blank';
      el.innerText = 'View Details' ;

      claimViewBtn.append(el);

      claimDetails.append(claimDetailsRating);
      claimDetails.append(claimViewBtn);

      relatedAChild.append(titleDiv);
      relatedAChild.append(claimDetails);

      relatedAContainer.append(relatedAChild);

    }

    relatedADiv.append(relatedASpan);
    relatedADiv.append(relatedAContainer);

    containerList.append(topdiv);
    containerList.append(relatedADiv);

    resultList.append(containerList);

  }
}