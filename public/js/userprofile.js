"use strict";
const upLoadForm = document.getElementById("upload-images-form");
upLoadForm.addEventListener("submit", uploadImages);

ready(function () {

  console.log("Client script loaded.");

  function ajaxGET(url, callback) {

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
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
      function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
    ).join('&');
    console.log("params in ajaxPOST", params);

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
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

  // document.querySelector("#LogOut").addEventListener("click", function (e) {
  //   e.preventDefault();
  //   localStorage.removeItem("AudioCave_Email");
  //   localStorage.removeItem("AudioCave_Password");
  //   window.location.replace("/logout");
  // })

  document.querySelector("#edit").addEventListener("click", function (e) {
    e.preventDefault();
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let username = document.getElementById("username");
    let age = document.getElementById("age");

    let queryString = "email=" + email.value + "&password=" + password.value + "&username=" + username.value + "&age=" + age.value;
    ajaxPOST("/updateprofile", function (data) {

      if (data) {
        let dataParsed = JSON.parse(data);
        window.location.replace("/userprofile");
      }

    }, queryString);

  });

  ajaxPOST("/getAllUserReviews", function(data) {
    if (data) {
      let dataParsed = JSON.parse(data);
      if (dataParsed.status == "fail") {
        document.getElementById("errorMsg").innerHTML = dataParsed.msg;
      } else {
        const container = document.getElementById("userReviews");
        while (data.indexOf("{") > 0) {
          let startRecord = data.indexOf("{");
          let endRecord = data.indexOf("}");
          let record = data.substring(startRecord, endRecord + 1);
          data = data.replace("{", "");
          data = data.replace("}", "");
          let dataParsed = JSON.parse(record);
          let review = document.createElement("div");
          review.classList.add("review");
          review.innerHTML = "<h5>" + dataParsed.title + "'s Review (" + dataParsed.dateOfReview 
            + ")</h5><p>" + dataParsed.review + "</p>";
          let editReview = document.createElement("p");
          editReview.classList.add("material-symbols-outlined");
          editReview.innerHTML = "edit";
          let deleteReview = document.createElement("p");
          deleteReview.classList.add("material-symbols-outlined");
          deleteReview.innerHTML = "delete";

          container.appendChild(review);
          container.appendChild(editReview);
          container.appendChild(deleteReview);

          editReview.onclick = function(event){ // Display at the top of the reviews
            event.preventDefault();
            review.innerHTML = "<h5>" + dataParsed.title + "'s Review (" + dataParsed.dateOfReview 
            + ")</h5>"; 
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
                + "&song=" + dataParsed.songID
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
            }, "song=" + dataParsed.songID);
          }
        } 
      }
    }
  }, "");

});

function uploadImages(e) {
  e.preventDefault();
  const imageUpload = document.querySelector('#image-upload');
  const formData = new FormData();

  for (let i = 0; i < imageUpload.files.length; i++) {
    // put the images from the input into the form data
    formData.append("files", imageUpload.files[i]);
  }
  const options = {
    method: 'POST',
    body: formData,
  };
  fetch("/upload-images", options
  ).then(function (res) {
    console.log(res);
  }).catch(function (err) { ("Error:", err) }
  );
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


function myFunction() {
  var x = document.getElementById("myLinks");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}