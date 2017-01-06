$(document).ready(function() {
	chrome.browserAction.setBadgeBackgroundColor({color: [255,0,0,255]});
	//chrome.browserAction.setBadgeText({text: "10"});
	var url = "http://www.reddit.com/r/";
	
    $.ajax({
        url: "http://www.reddit.com/r/GlobalOffensive/new.json",
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
				for(var i = 0; i < posts.length; i++){
					if(posts[i].data.clicked === false){
						count++;
						//dict["" + posts[i].data.title] = "" + posts[i].data.selftext;
						var $item = $("#post").clone();
						$item.find("#title").text("" + number++ + ") " + posts[i].data.title);
						if(posts[i].data.selftext_html !== null){
							$item.find("#text").text("" + posts[i].data.selftext.substring(0, 90) + "...");
						}
						$item.appendTo("#list");
					}
				}
            }
			chrome.browserAction.setBadgeText({text: "" + count});
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Reload the page if the server went down
            if(jqXHR.readyState == 0 && jqXHR.status == 0) {
                // REMOVE THIS
            }

            // Check for Unauthorized
            if(jqXHR.status == 401) {
                // REMOVE THIS
            }

            // Handle server 500
            if(jqXHR.status == 500) {
                // TODO
            }
        }
    });

});
