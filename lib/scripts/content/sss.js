
let profanityWords='';

var URL= chrome.extension.getURL('../../common/profanity_list_en.json');
var request = new XMLHttpRequest();
request.open('GET', URL , false);  // `false` makes the request synchronous
request.send(null);
if (request.status === 200) {
  var msgs = JSON.parse(request.responseText);
  //console.log(msgs.list);
  profanityWords=msgs.list;
}
console.log(profanityWords);

function execute(){
  for(var i = 0, len = profanityWords.length; i < len; i++){
    let searchTerm=profanityWords[i];
    matchText(document.body, new RegExp('\\b' + searchTerm + '\\b', 'i'), function(node, match, offset) {
      var span = document.createElement('span');
      // span.parentNode.id="bblur";

      span.id = 'SSS-blur';
      span.textContent = match;
      span.style.filter='blur(5px)';
      span.addEventListener('mouseover', mouseOver, false);
      span.addEventListener('mouseout', mouseOut, false);
      return span;

    });

  }
}

//var targetNode = document.body;
var targetNode = document.getElementsByTagName('div')[0];
var config = {childList:true,subtree: true};
var callback = function(mutationsList, observer) {
  execute();

  mutationsList.forEach(function (mutation) {
    mutation.addedNodes.forEach(function (node) {
      if (node.nodeType === 1) { // ELEMENT_NODE
        console.log(node);
        facebook_clickbait(node);
      }

    });
  });
};

var observer = new MutationObserver(callback);
observer.observe(targetNode, config);




var matchText = function(node, regex, callback, excludeElements) { 

  excludeElements || (excludeElements = ['script', 'style', 'iframe', 'canvas','i','button','input','head','form','noscript','header','img']);
  var child = node.firstChild;

  while (child) {
    switch (child.nodeType) {
      case 1: //ELEMENT_NODE
        if (excludeElements.indexOf(child.tagName.toLowerCase()) > -1)
          break;
        if (child.id !== 'SSS-blur') {
          matchText(child, regex, callback, excludeElements);
        }
            
        break;
      case 3: //CHILD_NODE
        var bk = 0;
        child.data.replace(regex, function(all) {
          var args = [].slice.call(arguments),
            offset = args[args.length - 2],
            newTextNode = child.splitText(offset+bk), tag;
          bk -= child.data.length + all.length;

          newTextNode.data = newTextNode.data.substr(all.length);
          tag = callback.apply(window, [child].concat(args));
          child.parentNode.insertBefore(tag, newTextNode);
          child = newTextNode;
        });
        regex.lastIndex = 0;
        break;
    }

    child = child.nextSibling;
  }

  return node;
};



function mouseOver()   //to test if pre-commit hook is working fine
{  
  this.style.filter='blur(0px)';
}

function mouseOut()
{  
  this.style.filter='blur(5px)';
}

