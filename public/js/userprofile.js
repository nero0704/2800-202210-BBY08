"use strict";
document.getElementById("submit").addEventListener("submit", uploadImages);

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

  // document.querySelector("#LogOut").addEventListener("click", function (e) {
  //   e.preventDefault();
  //   localStorage.removeItem("AudioCave_Email");
  //   localStorage.removeItem("AudioCave_Password");
  //   window.location.replace("/logout");
  // })

  document.querySelector("#edit").addEventListener("click", function(e) {
    e.preventDefault();
    let email = document.querySelector("#email input").value;
    let password = document.querySelector("#password input").value;
    let username = document.querySelector("#username input").value;
    let age = document.querySelector("#age input").value;

    let emailH1 = "<h1>" + email + "</h1>";
    let passwordH1 = "<h1>" + password + "</h1>";
    let usernameH1 = "<h1>" + username + "</h1>";
    let ageH1 = "<h1>" + age + "</h1>";

    document.getElementById("email").innerHTML = emailH1;
    document.getElementById("password").innerHTML = passwordH1;
    document.getElementById("username").innerHTML = usernameH1;
    document.getElementById("age").innerHTML = ageH1;

    let queryString = "email=" + email + "&password=" + password + "&username=" + username + "&age=" + age;
    ajaxPOST("/updateprofile", function(data) {

      if (data) {
        let dataParsed = JSON.parse(data);
        window.location.replace("/userprofile");
      }
    }, queryString);
    document.getElementById("edit").style = "display: none";
  });

  document.querySelector("#edit-profile").addEventListener("click", (e) => {
    e.preventDefault();
    let emailInput = "<input id='email' type='email' value='" + document.querySelector("#email h1").innerHTML + "'>";
    let passwordInput = "<input id='password' type='password' value='" + document.querySelector("#password h1").innerHTML + "'>";
    let usernameInput = "<input id='username' type='username' value='" + document.querySelector("#username h1").innerHTML + "'>";
    let ageInput = "<input id='age' type='age' value='" + document.querySelector("#age h1").innerHTML + "'>";

    document.getElementById("email").innerHTML = emailInput;
    document.getElementById("password").innerHTML = passwordInput;
    document.getElementById("username").innerHTML = usernameInput;
    document.getElementById("age").innerHTML = ageInput;
    document.getElementById("edit").style = "display: block";
  })
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
  fetch("/upload-images", options).then(function(res) {
    console.log(res);
  }).catch(function(err) {
    ("Error:", err)
  });
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