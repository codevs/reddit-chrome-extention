// We should stick to TAB being two spaces. Not actual tabs
// if your editor allows for .editorconfig please turn it on
// look up what it is. It changes the settings of an editor so they are the
// same between computers

$(document).ready(function() {
  chrome.browserAction.setBadgeBackgroundColor({color: [255,0,0,255]});
  //chrome.browserAction.setBadgeText({text: "10"});
  const base_url = "http://www.reddit.com/r/";
  var subreddit = "ClassicOffensive";
  var sorting = "new";

  var URL = base_url + subreddit + "/" + sorting + ".json";

  $.ajax({
    url: URL,
    type: 'GET',
    dataType: 'json',
    beforeSend : function(xhr) {
       // xhr.setRequestHeader("Authorization", "Bearer " + token);
    },
    success: function(data, textStatus, jqXHR) {
      var count = 0;
      var posts = data.data.children;
      if(jqXHR.status == 200) {
        var number = 1;
        for(var i = 0; i < posts.length; i++) {
          if(posts[i].data.clicked === false) {
            count++;
            //dict["" + posts[i].data.title] = "" + posts[i].data.selftext;
            var $item = $("#post").clone();
            $item.find("#title").text("" + number++ + ") " + posts[i].data.title);
            $item.click(function() {
              window.open("reddit.com");
            });
            //var $win = $item.find("a").attr( "href","reddit.com" + posts[i].data.permalink);
            if(posts[i].data.selftext_html !== null) {
              $item.find("#text").text("" + posts[i].data.selftext.substring(0, 90) + "...");
            }
            $item.appendTo("#list");
          }
        }
      }
      chrome.browserAction.setBadgeText({text: "" + count});
    }
  });
});
