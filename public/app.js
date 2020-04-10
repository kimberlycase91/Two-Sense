$(document).ready(function () {
  console.log("ready");
  $("#comment-div").hide();

  $(".view-add-comments").on("click", function () {
    var articleID = $(this).attr("data-id");
    console.log(articleID);
    $("#comment-div").show();
    $("#comments").empty();
    $.ajax({
      method: "GET",
      url: "/articles/" + articleID
    })
      // With that done, add the note information to the page
      .then(function (data) {
        console.log(data.comment);
        var commentArray = data.comment;
        console.log(commentArray);
        if (commentArray) {
          // for (var i=0; i<commentArray.length; i++) {
            var userName = $("<h3>");
            userName.text(commentArray.name);
            var userComment = $("<p>");
            userComment.text(commentArray.body);
            userName.append(userComment);
            $("#comments").append(userName);
          // }
        }
        else {
          var noComment = $("<h3>");
          noComment.text("Be the first to add a comment");
          $("#comments").append(noComment);
        };
      });


    $(".submit-btn").on("click", function () {
      event.preventDefault();
      var newComment = {
        name: $(".user-name").val(),
        body: $(".comment-text").val()
      }
      console.log(newComment);
      console.log(articleID);
      $.ajax({
        method: "POST",
        url: "/articles/" + articleID,
        data: newComment
      })
        .then(function (data) {
          console.log("added: " + data);
        });
      $(".user-name").val("");
      $(".comment-text").val("");
    });
  })
});