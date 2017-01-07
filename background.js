chrome.tabs.onCreated.addListener(function(tab) {
  chrome.tabs.create({'url':"http://www.reddit.com"});
  chrome.tabs.update({'url':"http://www.reddit.com"});
});

chrome.tabs.onUpdated.addListener(function (tab) {
  chrome.tabs.create({'url':"http://www.reddit.com"});
});

