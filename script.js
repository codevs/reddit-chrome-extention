$(document).ready(function() {
	$('#text').text("Hello World");
	chrome.browserAction.setBadgeBackgroundColor({color: [255,0,0,255]});
  	chrome.browserAction.setBadgeText({text: "10"});
  	 $.getJSON(
        "http://www.reddit.com/r/pics.json?jsonp=?",
        function foo(data)
        {
          $.each(
            data.data.children.slice(0, 10),
            function (i, post) {
              $("#text").append( '<br>' + post.data.title );
              $("#text").append( '<br>' + post.data.url );
              $("#text").append( '<br>' + post.data.permalink );
              $("#text").append( '<br>' + post.data.ups );
              $("#text").append( '<br>' + post.data.downs );
              $("#text").append( '<hr>' );
            }
          )
        }
      )
      .success(function() { alert("second success"); })
      .error(function() { alert("error"); })
      .complete(function() { alert("complete"); });
});
