ready(function() {

    console.log("Client script loaded.");

    function ajaxGET(url, callback) {

        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
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
                function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
            ).join('&');
        console.log("params in ajaxPOST", params);

        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
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

    var date = (new Date()).toISOString().split('T')[0];
    let queryString = "date=" + date;
    ajaxPOST("/get-suggestions", function(data) {
        if(data) {
            let dataParsed = JSON.parse(data);
            if (dataParsed.status=="success") {
                console.log(dataParsed)
                let str = ""
                for(let i = 0; i< dataParsed.rows.length; i++) {
                    let row = dataParsed.rows[i];
                    str += ('<img src="/img/songs/' + row.filesrc 
                        + '" class="music-rec" alt="' + row.ID
                        + '" style="width:42px;height:42px;">'
                        + '<h2>' + row.title
                        + '</h2><br><h3>' + row.artist
                        + '</h3>'

                    );
                    console.log(str);
                }
                document.getElementById("music-suggestion-container").innerHTML = str;

                let records = document.querySelectorAll("img.music-rec");
                for(let j = 0; j < records.length; j++) {
                    records[j].addEventListener("click", function(e) {
                        e.preventDefault();
                        songID = this.alt;
                        sessionStorage.setItem("song", songID)
                        window.location.replace("/songinfo");
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