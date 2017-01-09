// We should stick to TAB being two spaces. Not actual tabs
// if your editor allows for .editorconfig please turn it on
// look up what it is. It changes the settings of an editor so they are the
// same between computers

$(document).ready(function() {
  chrome.browserAction.setBadgeBackgroundColor({color: [255,0,0,255]});
  //chrome.browserAction.setBadgeText({text: "10"});
  const base_url = "http://www.reddit.com/r/";
  var subreddit = "GlobalOffensive";
  var sorting = "hot";
  var titles = [];
  var count = 1;
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
                          var item = "<li class='font'><a id='subredditLink' href=" + base_url + $("#subreddit").val()
                              + ">" + $("#subreddit").val() + "</a></li>";
                          $(item).appendTo("#subredditList");
                          subreddit = $("#subreddit").val();
                          $("#subreddit").val("");
                      }else{
                      }
                  }
              },
              error: function(data, textStatus, jqXHR){
                  $("#subreddit").val("");
              }
          });
      }
  });
  $("#sorting").change(function(){
      sorting = $("#sorting option:selected").text();
  });
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
            if(posts[i].data.clicked === false && newTitle("" + posts[i].data.title) === true) {
              titles.push("" + posts[i].data.title);
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
  function newTitle(s){
      for(var i = 0; i < titles.length; i++){
          if(titles[i] === s){
              return false;
          }
      }
      return true;
  }
  //This is temporary for later when we will need to make the extension constantly run and do checks.
  checkForNewPosts();
  $("#subredditList").on("click", ".font", function(e){
      subreddit = $(this).text();
      alert(subreddit);
      emptyList();
      checkForNewPosts();

  });
});
