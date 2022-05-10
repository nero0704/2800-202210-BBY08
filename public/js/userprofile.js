ready(function () {

  console.log("Client script loaded.");

  function ajaxGET(url, callback) {

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        //console.log('responseText:' + xhr.responseText);
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
        //console.log('responseText:' + xhr.responseText);
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

  document.querySelector("#submit").addEventListener("click", function (e) {
    e.preventDefault();
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let username = document.getElementById("username");
    let age = document.getElementById("age");

    let queryString = "email=" + email.value + "&password=" + password.value + "&username=" + username.value + "&age=" + age.value;
    ajaxPOST("/updateprofile", function (data) {

      if (data) {
        let dataParsed = JSON.parse(data);
        console.log(dataParsed);
        window.location.replace("/userprofile");
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