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