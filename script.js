// We should stick to TAB being two spaces. Not actual tabs
// if your editor allows for .editorconfig please turn it on
// look up what it is. It changes the settings of an editor so they are the
// same between computers


var RedditData = {
  loggedIn: false,
  token: "",
  refresh_token: "",
  expireDate: 0,
  uri: ""
};

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

  function handleSucess() {
    var posts = data.data.children;
    if(jqXHR.status == 200) {
      for(var i = 0; i < posts.length; i++) {
        if(posts[i].data.clicked === false) {
          //dict["" + posts[i].data.title] = "" + posts[i].data.selftext;
          var $item = $("#post").clone();
          $item.find("#title").text("" + count++ + ") " + posts[i].data.title);
          $item.find("#text").text("" + posts[i].data.selftext.substring(0, 90) + "...");
          if(posts[i].data.selftext_html !== null) {
          }
          $item.find("#link").attr("href", "" + posts[i].data.url);
          $item.appendTo("#list");
        }
      }
    }
    chrome.browserAction.setBadgeText({text: "" + (count-1)});
  }

  function checkWithNoAuth() {
    var URL = base_url + subreddit + "/" + sorting + ".json";
    $.ajax({
      url: URL,
      type: 'GET',
      dataType: 'json',
      success: function(data, textStatus, jqXHR) {
        handleSucess();
      }
    });
  }

  function checkWithAuth() {
    var URL = base_url + subreddit + "/" + sorting + ".json";
    $.ajax({
      url: URL,
      type: 'GET',
      dataType: 'json',
      beforeSend : function(xhr) {
         xhr.setRequestHeader("Authorization", "Bearer " + RedditData.token);
      },
      success: function(data, textStatus, jqXHR) {
        handleSucess();
      }
    });
  }

  function checkForNewPosts(){
    if (RedditData.loggedIn) {
      checkWithAuth();
    } else {
      checkWithNoAuth();
    }
  }

  function sortingChanged() {
    sorting = $("#sorting").val();
    console.log("sorting: " + sorting);
  }

  function newTitle(s) {
    for(var i = 0; i < titles.length; i++){
      if(titles[i] === s){
        return false;
      }
    }
    return true;
  }

  var data;

  function getToken(code, uri, client) {
    var data = "grant_type=authorization_code&code=" + code + "&redirect_uri=" + uri;

    $.ajax({
      url: URL,
      type: 'POST',
      data: data,
      dataType: 'json',
      beforeSend : function(xhr) {
        xhr.setRequestHeader ("Authorization", "Basic " + btoa(client + ":" + ""));
      },
      success: function(data, textStatus, jqXHR) {
        RedditData.loggedIn = true;
        RedditData.token = data.access_token;
        RedditData.refresh_token = data.refresh_token;
        RedditData.expireDate = data.expires_in;
      },
      error: function(jqXHR, textStatus, errorThrown) {

      }
    });
  }

  function authorize() {
    const baseURL = "https://www.reddit.com/api/v1/authorize"
    const clientID = "CAkDeHjpPz8ZWw";
    const type = "code";
    const rURI = "https://efpldkoaoakkglfgdhhfbbhckchoeeaf.chromiumapp.org/reddit";
    const duration = "permanent";
    const state = "1234";
    const scope = "identity,history";

    let URL = baseURL + "?client_id=" + clientID + "&response_type=" + type
                + "&state=" + state + "&redirect_uri=" + rURI + "&duration=" + duration
                + "&scope=" + scope;


    console.log("URL:" + URL);
    chrome.identity.launchWebAuthFlow(
      {'url': URL, 'interactive': true},
      function(redirect_url) {
        console.log("RESPONSE: " + redirect_url);
        // Read this: https://github.com/reddit/reddit/wiki/OAuth2

        // TODO retrieve code form redirect url, example below
        // https://efpldkoaoakkglfgdhhfbbhckchoeeaf.chromiumapp.org/reddit?state=1234&code=-RfbB1Pu-74MESMezczJZ4d7jrg
        // plus check if state matches the state variable on top
        var g = redirect_url.substring(redirect_url.indexOf("code="));

        // TODO make POST request tohttps://www.reddit.com/api/v1/access_token
        // and data of : grant_type=authorization_code&code=CODE&redirect_uri=URI
      });
  }

  //This is temporary for later when we will need to make the extension constantly run and do checks.
  checkForNewPosts();
  authorize();
  $("#subredditList").on("click", ".font", function(e) {
    subreddit = $(this).text().substring(base_url.indexOf("/r/" + 3));
    emptyList();
    checkForNewPosts();
  });
});
