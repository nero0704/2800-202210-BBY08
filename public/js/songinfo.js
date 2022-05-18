"use strict";
ready(function() {

  console.log("Client script loaded.");

  function ajaxGET(url, callback) {

    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        callback(this.responseText);

      } else {
        console.log(this.status);
      }
    }
    xhr.open("GET", url);
    xhr.send();
  }

  function ajaxPOST(url, callback, data) {

    let params = typeof data == 'string' ? data : Object.keys(data).map(
      function(k) { return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
    ).join('&');
    console.log("params in ajaxPOST", params);

    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        callback(this.responseText);

      } else {
        console.log(this.status);
      }
    }
    xhr.open("POST", url);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);
  }

  let songID = sessionStorage.getItem("song");
  let queryString = "songID=" + songID;
  ajaxPOST("/get-song-info", function(data) {
    if (data) {
      let dataParsed = JSON.parse(data);
      if (dataParsed.status == "success") {
        let row = dataParsed.rows[0];
        let str = '<img src="/img/songs/' + row.filesrc +
          '" class="music-image" alt="' + row.title +
          '">' +
          '<h2>' + row.title +
          '</h2><h3>' + row.artist +
          '</h3></div>' +
          '<a href="' + row.youtubeLink +
          '"><img src="/img/songs/youtube-logo.png' +
          '" class="music-youtube-link" alt="Youtube"' +
          '"></a>' +
          '<a href="' + row.spotifyLink +
          '"><img src="/img/songs/spotify-logo.png' +
          '" class="music-spotify-link" alt="Spotify"' +
          '"></a>'

        document.getElementById("song").innerHTML = str;
      }
    }
  }, queryString)

  // Submit reviews
  document.getElementById("submitReview").addEventListener("click", function(e){
    e.preventDefault();
    let queryString = "review=" + document.getElementById("review").value 
      + "&song=" + sessionStorage.getItem("song")
      + "&date=" + (new Date()).toISOString();
    ajaxPOST("/reviewSong", function(data){
      let dataParsed = JSON.parse(data);
      if (dataParsed.status == "fail") {
        document.getElementById("errorMsg").innerHTML = dataParsed.msg;
      } else {
        location.reload();
      }
    }, queryString);
  });

  // Display this user's review
  ajaxPOST("/displayUserReview", function(data){
    let dataParsed = JSON.parse(data);
    if (dataParsed.status == "fail") {
      //document.getElementById("errorMsg").innerHTML = dataParsed.msg;
    } else {
      console.log(dataParsed);
      const container = document.getElementById("userReview");
      let review = document.createElement("div");
      review.classList.add("review");
      review.innerHTML = "<h5>" + dataParsed.userName + "'s Review</h5><p>" + dataParsed.review + "</p>";
      let editReview = document.createElement("p");
      editReview.classList.add("material-symbols-outlined");
      editReview.innerHTML = "edit";
      let deleteReview = document.createElement("p");
      deleteReview.classList.add("material-symbols-outlined");
      deleteReview.innerHTML = "delete";

      container.appendChild(editReview);
      container.appendChild(deleteReview);
      container.appendChild(review);

      editReview.onclick = function(event){ // Display at the top of the reviews
        event.preventDefault();
        review.innerHTML = "<h5>" + dataParsed.userName + "'s Review</h5>"; 
        let input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Write your review here...";
        let confirm = document.createElement("p");
        confirm.classList.add("material-symbols-outlined");
        confirm.innerHTML = "done";
        let cancel = document.createElement("p");
        cancel.classList.add("material-symbols-outlined");
        cancel.innerHTML = "close";
        review.appendChild(input);
        review.appendChild(confirm);
        review.appendChild(cancel);
        container.innerHTML = "";
        container.appendChild(review);

        //Submit New Review
        confirm.onclick = function(event) {
          event.preventDefault();
          let queryString = "review=" + input.value 
            + "&song=" + sessionStorage.getItem("song")
            + "&date=" + (new Date()).toISOString();
          ajaxPOST("/editReview", function(data){
            if (data) {
              let dataParsed = JSON.parse(data);
              if (dataParsed.status == "fail") {
                document.getElementById("errorMsg").innerHTML = dataParsed.msg;
              } else {
                location.reload();
              }
            }
          }, queryString);
        };

        // Cancel Review Editing
        cancel.onclick = function(event) {
          event.preventDefault();
          location.reload();
        };
      };

      deleteReview.onclick = function(e){
        e.preventDefault();
        ajaxPOST("/deleteReview", function(data){
          if (data) {
            let Data = JSON.parse(data);
            if (Data.status == "fail") {
              document.getElementById("errorMsg").innerHTML = Data.msg;
            } else {
              location.reload();
            }
          }
        }, "song=" + sessionStorage.getItem("song"));
      };
    }
  }, "song=" + sessionStorage.getItem("song"));

  // Display rest of reviews
  ajaxPOST("/displayOtherReviews", function(data){
    let dataParsed = JSON.parse(data);
    if (dataParsed.status == "fail") {
      //document.getElementById("errorMsg").innerHTML = dataParsed.msg;
    } else {
      while (data.indexOf("{") > 0) {
        let container = document.getElementById("otherReviews");
        let startRecord = data.indexOf("{");
        let endRecord = data.indexOf("}");
        let record = data.substring(startRecord, endRecord + 1);
        data = data.replace("{", "");
        data = data.replace("}", "");
        let dataParsed = JSON.parse(record);
        let review = document.createElement("div");
        review.classList.add("review");
        review.innerHTML = "<h5>" + dataParsed.userName + "'s Review</h5><p>" + dataParsed.review + "</p>";
        container.appendChild(review);
      }
    }
  }, "song=" + sessionStorage.getItem("song"));

});

function ready(callback) {
  if (document.readyState != "loading") {
    callback();
    console.log("ready state is 'complete'");
  } else {
    document.addEventListener("DOMContentLoaded", callback);
    console.log("Listener was invoked");
  }
}