"use strict";
document.getElementById("post").addEventListener("click", uploadPostImages);

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

  ajaxPOST("/getAllUserReviews", function(data) {
    if (data) {
      let dataParsed = JSON.parse(data);
      if (dataParsed.status == "fail") {
        document.getElementById("errorMsg").innerHTML = dataParsed.msg;
      } else {
        const container = document.getElementById("post-container");
        while (data.indexOf("{") > 0) {
          let startRecord = data.indexOf("{");
          let endRecord = data.indexOf("}");
          let record = data.substring(startRecord, endRecord + 1);
          data = data.replace("{", "");
          data = data.replace("}", "");
          let dataParsed = JSON.parse(record);
          let review = document.createElement("div");
          review.classList.add("review");
          const path = dataParsed.filesrc == "default" ? "./img/" : "./img/songs/";
          const filesrc = dataParsed.filesrc == "default" ? "default.img" : dataParsed.filesrc;
          review.innerHTML = "<h5>" + dataParsed.title + "'s Review (" + formatDate(dataParsed.dateOfReview) +
            ")</h5><div class='songimg'><img class='image' src=" + path + filesrc + " alt='Review Picture' style='width:150px;height:150px;'></div>" +
            "<p>" + dataParsed.review + "</p>";

          container.appendChild(review);
        }
      }
    }
  }, "");

  //Display User's Posts
  ajaxPOST("/displayPosts", function(data) {
    if (data) {
      let Data = JSON.parse(data);
      if (Data.status == "fail") {
        document.getElementById("errorMsg").innerHTML = Data.msg;
      } else {
        const container = document.getElementById("post-container");
        while (data.indexOf("{") > 0) {
          let startRecord = data.indexOf("{");
          let endRecord = data.indexOf("}");
          let record = data.substring(startRecord, endRecord + 1);
          data = data.replace("{", "");
          data = data.replace("}", "");
          let dataParsed = JSON.parse(record);
          let post = document.createElement("div");
          post.classList.add("post");
          const path = dataParsed.filesrc == "default" ? "./img/" : "./upload/";
          const filesrc = dataParsed.filesrc == "default" ? "default.img" : dataParsed.filesrc;
          post.innerHTML = "<h5>" + dataParsed.userName + "'s Post (" + formatDate(dataParsed.dateOfPost) +
            ")</h5><div class='songimg'><img class='image' src=" + path + filesrc + " alt='Post Picture' style='width:150px;height:150px;'></div><p>" +
            dataParsed.post + "</p>";

          container.appendChild(post);
        }
      }
    }
  }, "");

});

function uploadPostImages(e) {
  e.preventDefault();
  const postImageUpload = document.getElementById("post-image-upload");
  const postFormData = new FormData();

  for (let i = 0; i < postImageUpload.files.length; i++) {
    // put the images from the input into the form data
    postFormData.append("files", postImageUpload.files[i]);
  }
  postFormData.append("body", document.getElementById("postText").value);
  postFormData.append("body", (new Date()).toISOString());
  const postOptions = {
    method: 'POST',
    body: postFormData,
  };
  fetch("/newPost", postOptions).then(function(res) {
    console.log(res);
    location.reload();
  }).catch(function(err) {
    ("Error:", err)
  });
}

function formatDate(date){
  console.log(date);
  let newDate = "";
  let start = 0;
  let end = date.indexOf("-");
  const year = date.substring(start, end);
  start = end + 1;
  date = date.replace("-", " ");
  end = date.indexOf("-");
  const month = date.substring(start, end);
  start = end + 1;
  date = date.replace("-", " ");
  end = date.indexOf("T");
  const day = date.substring(start, end);
  start = end + 1;
  date = date.replace("T", " ");
  end = date.indexOf(":");
  const hours = date.substring(start, end);
  start = end + 1;
  date = date.replace(":", " ");
  end = date.indexOf(":");
  const minutes = date.substring(start, end);
  start = end + 1;
  end = date.indexOf(".");
  const seconds = date.substring(start, end);
  newDate = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds
  return newDate;
}

function ready(callback) {
  if (document.readyState != "loading") {
    callback();
    console.log("ready state is 'complete'");
  } else {
    document.addEventListener("DOMContentLoaded", callback);
    console.log("Listener was invoked");
  }
}

function hamburger() {
  var x = document.getElementById("top-menu");
  if (x.style.display === "grid") {
    x.style.display = "none";
  } else {
    x.style.display = "grid";
  }
}