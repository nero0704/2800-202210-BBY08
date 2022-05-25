"use strict";
//
// 
// This is for the modal pop-up (Survey)
//
//
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal on mobile
var btn = document.getElementsByClassName("myBtn")[0];

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Get the button that opens the modal
var btn2 = document.getElementsByClassName("myBtn")[1];

// When the user clicks the button, open the modal 
btn.onclick = function () {
    modal.style.display = "block";
    var x = document.getElementById("top-menu");
    if (x.style.display === "grid") {
        x.style.display = "none";
    }
}

btn2.onclick = function () {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

//
// 
// This is for the survey post to Database(Survey)
//
//
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

    document.querySelector("#submit-survey").addEventListener("click", function (e) {
        e.preventDefault();
        document.getElementById('myModal').style.display = 'none';
        let mood = document.querySelector('input[name="mood"]:checked').value
        let date = (new Date()).toISOString().split('T')[0];
        let queryString = "mood=" + mood + "&date=" + date;
        ajaxPOST("/daily-survey", function (data) {
            if (data) {
                let dataParsed = JSON.parse(data);
                if (dataParsed.status == "fail") {
                    console.log(dataParsed.msg);
                }
            }
        }, queryString);
    })
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
