$(document).ready(function() {
    $.ajax({
        url: "http://www.reddit.com/r/GlobalOffensive/new.json",
        type: 'GET',
        dataType: 'json',
        beforeSend : function(xhr) {
            // xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: function(data, textStatus, jqXHR) {
            if(jqXHR.status == 200) {
                $("#title").text(data.data.children[0].data.title);
            }
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
