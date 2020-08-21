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