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

  function getSavedLogin() {
    return new Promise((resolve, reject) => {
      if (localStorage.getItem("AudioCave_Email") != null &&
        localStorage.getItem("AudioCave_Password") != null) {
        let email = localStorage.getItem("AudioCave_Email");
        let password = localStorage.getItem("AudioCave_Password");
        let credential = {
          email: email,
          password: password
        };
        resolve(credential);
      } else {
        reject(new Error("No Saved Login."));
      }
    })
  }

  getSavedLogin()
    .then((cred) => {
      let queryString = "email=" + cred.email + "&password=" + cred.password;
      ajaxPOST("/login", function(data) {
        if (data) {
          let dataParsed = JSON.parse(data);
          if (dataParsed.role == 'A') {
            window.location.replace("../html/admindashboard.html");
          }
        }

      }, queryString);
    })
    .catch((e) => {
      console.log(e);
    })

  document.querySelector("#register").addEventListener("click", function(e) {
    e.preventDefault();
    window.location.replace("/signup");
  })

  // POST TO THE SERVER
  document.querySelector("#submit").addEventListener("click", function(e) {
    e.preventDefault();
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let saveLogin = document.getElementById("save-login");
    let queryString = "email=" + email.value + "&password=" + password.value;
    if (saveLogin.checked == true) {
      localStorage.setItem("AudioCave_Email", email.value);
      localStorage.setItem("AudioCave_Password", password.value);
    }
    ajaxPOST("/login", function(data) {
      if (data) {
        let dataParsed = JSON.parse(data);
        if (dataParsed.status == "fail") {
          document.getElementById("errorMsg").innerHTML = dataParsed.msg;
        } else if (dataParsed.role == 'A') {
          window.location.replace("../html/admindashboard.html");
        } else {
          window.location.replace("/main");
        }
      }
    }, queryString);
  });
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