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

    function getSongs(album) {
        let queryString = "albumID=" + album;
        ajaxPOST("/get-songs-in-album", function (data) {
            if (data) {
                let dataParsed = JSON.parse(data);
                if (dataParsed.status == "success") {
                    let str = "";
                    for (let i = 0; i < dataParsed.rows.length; i++) {
                        let row = dataParsed.rows[i];
                        str += ('<li class="song" id="' + row.ID +
                        '"><img src="/img/songs/' + row.filesrc +
                        '" class="music-rec" style="width:200px;height:200px" alt="' + row.ID +
                        '"></img><h3>' + row.title +
                        '</h3><p>' + row.artist +
                        '</p></li>');
                    }
                    document.getElementById("song-list").innerHTML = str;
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
            }
        }, queryString)
    }

    let queryString = ""
    ajaxPOST("/get-new-albums", function (data) {
        if (data) {
            let dataParsed = JSON.parse(data);
            if (dataParsed.status == "success") {
                let str = "";
                for (let i = 0; i < dataParsed.rows.length; i++) {
                    let row = dataParsed.rows[i];
                    str += ('<li class="album" id="' + row.ID +
                    '"><img src="/img/songs/' + row.filesrc +
                    '" class="music-rec" style="width:200px;height:200px" alt="' + row.ID +
                    '"></img><h3>' + row.title +
                    '</h3><p>' + row.artist +
                    '</p></li>');
                }
                document.getElementById("song-list").innerHTML = str;

                let records = document.querySelectorAll("li.album");
                for (let j = 0; j < records.length; j++) {
                    records[j].addEventListener("click", function(e) {
                        e.preventDefault();
                        for(let a = 0; a < records.length; a++) {
                            var albumlist = document.getElementsByClassName("album");
                            for (let b = 0; b < albumlist.length; b++) {
                                albumlist[b].remove();
                            }
                        }
                        let album = this.id;
                        getSongs(album);
                    });
                }                
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

function hamburger() {
    var x = document.getElementById("top-menu");
    if (x.style.display === "grid") {
      x.style.display = "none";
    } else {
      x.style.display = "grid";
    }
}