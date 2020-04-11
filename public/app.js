$(document).ready(function () {
  console.log("ready");
  $("#comment-div").hide();

  $("#scrape").on("click", function () {
    // console.log("scraping for new articles")
    $.ajax({
      method: "GET",
      url: "/scrape"
    }).then(function (data) {
      console.log("scraped /n/n" + data)
    })
    location.reload();
  });

  $(".view-add-comments").on("click", function () {
    var articleID = $(this).attr("data-id");
    var articleTitle = $(this).attr("data-title");
    console.log(articleID);
    console.log(articleTitle);
    $("#comment-div").show();
    $("#comments").empty();
    // var title = $("<h3>");
    var title = $("#title");
    title.text(articleTitle);
    $("#comment-div").prepend(title);
    $.ajax({
      method: "GET",
      url: "/api/articles/" + articleID
    })
      // With that done, add the note information to the page
      .then(function (data) {
        console.log(data);
        var commentArray = data.comment;
        if (commentArray) {
          // for (var i=0; i<commentArray.length; i++) {
          var userName = $("<h5>");
          userName.text(commentArray.name + "'s Two Cents:");
          var userComment = $("<p>");
          userComment.text(commentArray.body);
          var deleteBtn = $("<button>");
          deleteBtn.text("Delete");
          deleteBtn.addClass("btn btn-secondary");
          deleteBtn.attr("id", "delete-btn");
          deleteBtn.attr("type", "button");
          deleteBtn.attr("data-id", commentArray._id);
          $("#comments").append(userName);
          $("#comments").append(userComment);
          $("#comments").append(deleteBtn);
          // }
        }
        else {
          var noComment = $("<p>");
          noComment.text("Be the first to add a comment");
          $("#comments").append(noComment);
        };
      });

    $(".submit-btn").on("click", function (event) {
      event.preventDefault();
      console.log($(".user-name").val());
      console.log($("#usercomment").text());

      var newComment = {
        name: $(".user-name").val(),
        body: $("#usercomment").val()
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
          console.log(JSON.stringify(data));
        });
      $(".user-name").val("");
      $("#usercomment").val("");
      location.reload();
    });

    $("#comment-div").on("click", "#delete-btn", function () {
      event.preventDefault();
      console.log("fuck this!!!");
      var commentID = $(this).attr("data-id");
      console.log(commentID);
      $.ajax({
        method: "DELETE",
        url: "/delete/" + commentID,
        success: function(data) {
          console.log("comment deleted")
        },
        error: function() {
          console.log("error");
        }
      })
        .then(function () {
          location.reload();
        });
    });
  })
});