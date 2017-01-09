// We should stick to TAB being two spaces. Not actual tabs
// if your editor allows for .editorconfig please turn it on
// look up what it is. It changes the settings of an editor so they are the
// same between computers

$(document).ready(function() {
  chrome.browserAction.setBadgeBackgroundColor({color: [255,0,0,255]});
  const base_url = "http://www.reddit.com/r/";
  var subreddit = "GlobalOffensive";
  var sorting = "hot";
  var subreddits = [];
  var count = 1;
  $("#subredditList").on("click", ".font", function(e){
      subreddit = $(this).text();
      emptyList();
      checkForNewPosts();

  });
  $("#subreddit").keypress(function(e){
      if(e.which == 13){
          $.ajax({
              url: base_url + $("#subreddit").val() + "/" + sorting + ".json",
              type: 'GET',
              dataType: 'json',
              beforeSend: function(xhr){
              },
              success: function(data, textStatus, jqXHR){
                  if(jqXHR.status === 200){
                      if(subredditExists() === false){
                        addSubredditToList($("#subreddit").val());
                      }
                  }
              },
              error: function(data, textStatus, jqXHR){
                  clearInput();
              }
          });
      }
  });
  $("#sorting").change(function(){
      sorting = $("#sorting option:selected").text();
      emptyList();
      checkForNewPosts();
  });
  $("#subredditList").change(function(){
      subreddit = $("#subredditList option:selected").text();
      emptyList();
      checkForNewPosts();
  });
  $("#menu").click(function(){
    this.classList.toggle("change");
    if($("#menuBackground").height() === 110){
      $("input, select").animate({opacity: 0}, .4);
      $("#menuBackground").animate({height: 43}, .4);
    }else{
      $("#menuBackground").animate({height: 110}, .4);
      $("input, select").animate({opacity: 1}, .4);
    }
  });
  function clearInput(){
    $("#subreddit").val("");
  }
  function addSubredditToList(s){
    var item = "<option class='font' value='" + s + "'>" + s + "</option>";
    $(item).appendTo("#subredditList");
    subreddit = s;
    clearInput();
    subreddits.push(s);
    chrome.storage.sync.set({'subreddits': subreddits});
  }
  function syncSubreddits(){
    chrome.storage.sync.get('subreddits', function(data){
      for(var i = 0; i < data.subreddits.length; i++){
      addSubredditToList(data.subreddits[i]);
    }
    }); 
  }
  function emptyList(){
      $("#list li:not(:first)").remove();
      titles = [];
      count = 1;
  }
  function subredditExists(){
      var r = false;
      $("#subredditList li").each(function(e){
          if($(this).text() === $("#subreddit").val()){
              return r = true;
          }
      });
      return r;
  }
  function checkForNewPosts(){
      var URL = base_url + subreddit + "/" + sorting + ".json";
      $.ajax({
      url: URL,
      type: 'GET',
      dataType: 'json',
      beforeSend : function(xhr) {
         // xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: function(data, textStatus, jqXHR) {
        var posts = data.data.children;
        if(jqXHR.status == 200) {
          for(var i = 0; i < posts.length; i++) {
            if(posts[i].data.clicked === false) {
              //dict["" + posts[i].data.title] = "" + posts[i].data.selftext;
              var $item = $("#post").clone();
              $item.find("#title").text("" + count++ + ") " + posts[i].data.title);
              if(posts[i].data.selftext_html !== null) {
                $item.find("#text").text("" + posts[i].data.selftext.substring(0, 90) + "...");
              }
              $item.find("#link").attr("href", "" + posts[i].data.url);
              $item.appendTo("#list");
            }
          }
        }
        chrome.browserAction.setBadgeText({text: "" + (count-1)});
      }
      });
      //setTimeout(checkForNewPosts, 1000);

  }
  syncSubreddits();
  checkForNewPosts();
});
