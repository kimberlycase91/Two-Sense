$(document).ready(function () {
  console.log("ready");
  $("#comment-div").hide();


  $(".view-add-comments").on("click", function () {
    var articleID = $(this).attr("data-id");
    var articleTitle = $(this).attr("data-title");
    console.log(articleID);
    console.log(articleTitle);
    $("#comment-div").show();
    $("#comments").empty();
    var title = $("<h2>");
    title.text(articleTitle);
    $("#comment-div").prepend(title);
    $.ajax({
      method: "GET",
      url: "/articles/" + articleID
    })
      // With that done, add the note information to the page
      .then(function (data) {
        console.log(data);
        var commentArray = data.comment;
        if (commentArray) {
          // for (var i=0; i<commentArray.length; i++) {
          var userName = $("<h3>");
          userName.text(commentArray.name + "'s Two Sense:");
          var userComment = $("<p>");
          userComment.text(commentArray.body);
          var deleteBtn = $("<button>");
          deleteBtn.text("Delete");
          deleteBtn.attr("id", "delete-btn");
          deleteBtn.attr("type", "button");
          deleteBtn.attr("data-id", commentArray._id);
          userName.append(userComment);
          $("#comments").append(userName);
          $("#comments").append(deleteBtn);
          // }
        }
        else {
          var noComment = $("<h3>");
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
    });

    $("#delete-btn").click(function() {
      event.preventDefault();
      console.log("fuck!!!");
      var commentID = $(this).attr("data-id");
      console.log(commentID);
    });
  })
});