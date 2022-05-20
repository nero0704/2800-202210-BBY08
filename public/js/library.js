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

    let queryString = ""
    ajaxPOST("/get-songs-in-library", function (data) {
        if (data) {
            let dataParsed = JSON.parse(data);
            if (dataParsed.status == "success") {
                let str = "";
                for (let i = 0; i < dataParsed.rows.length; i++) {
                    let row = dataParsed.rows[i];
                    console.log(row);
                    str += ('<li class="song" id="' + row.ID +
                        '"><img src="/img/songs/' + row.filesrc +
                        '" class="music-rec" style="width:100px;height:100px" alt="' + row.ID +
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