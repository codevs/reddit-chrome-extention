//chrome.tabs.onCreated.addListener(function(tab) {
  //chrome.tabs.create({'url':"http://www.reddit.com"});
chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
    //if(message.url != null)
      chrome.tabs.create({'url':message.url});
}); 
//});

//chrome.tabs.onUpdated.addListener(function (tab) {
  //chrome.tabs.create({'url':"http://www.reddit.com"});
//});

