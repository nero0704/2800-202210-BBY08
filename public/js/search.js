"use strict";

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

  let queryString = "";
  ajaxPOST("/get-all-songs", function (data) {
    if (data) {
      let dataParsed = JSON.parse(data);
      songs = dataParsed;
      let htmlString = "";
      console.log(songs.rows.length);
      for (let z = 0; z < songs.rows.length; z++) {
        let row = songs.rows[z];
        htmlString += ('<li class="song" id="' + row.ID +
          '"><img src="/img/songs/' + row.filesrc +
          '" class="music-rec" style="width:100px;height:100px" alt="' + row.ID +
          '"></img><h3>' + row.title +
          '</h3><p>' + row.artist +
          '</p></li>');
      }
      document.getElementById("song-list").innerHTML = htmlString;
      let records = document.querySelectorAll("li.song");
      for (let j = 0; j < records.length; j++) {
        records[j].addEventListener("click", function (e) {
          e.preventDefault();
          let songID = this.id;
          sessionStorage.setItem("song", songID)
          window.location = "/songinfo";
        })
      }
    }
  }, queryString)

});

let songs = [];
const searchBar = document.getElementById('searchBar');
searchBar.addEventListener('keyup', (e) => {
  const searchString = e.target.value.toLowerCase();
  const filteredSongs = songs.rows.filter(function (el) {
    return el.title.toLowerCase().includes(searchString) ||
      el.artist.toLowerCase().includes(searchString);
  });
  displaySongs(filteredSongs);
});

function displaySongs(songs) {
  let htmlString = "";
  console.log(songs.length);
  for (let z = 0; z < songs.length; z++) {
    let row = songs[z];
    htmlString += ('<li class="song" id="' + row.ID +
      '"><img src="/img/songs/' + row.filesrc +
      '" class="music-rec" style="width:100px;height:100px" alt="' + row.ID +
      '"></img><h3>' + row.title +
      '</h3><p>' + row.artist +
      '</p></li>');
  }
  document.getElementById("song-list").innerHTML = htmlString;
  let records = document.querySelectorAll("li.song");
  for (let j = 0; j < records.length; j++) {
    records[j].addEventListener("click", function (e) {
      e.preventDefault();
      let songID = this.id;
      sessionStorage.setItem("song", songID)
      window.location = "/songinfo";
    })
  }
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