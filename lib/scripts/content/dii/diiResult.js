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
	
//   var body = document.getElementsByTagName("body")[0]
//   body.append(p["a"])

// var resultDiv = document.getElementById("resultDiv");
// resultDiv.class = "container"

// var img = document.createElement('img');
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

// resultDiv.append(para)



