ready(function() {

  console.log("Admin Dashboard script loaded.");

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
      function(k) { return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
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

  const regularDashboard = document.querySelector("#regular");
  const admindashboard = document.querySelector("#admins");

  ajaxPOST("/userInfo", function printRegular(data) {
    while (data.indexOf("{") > 0) {
      let startRecord = data.indexOf("{");
      let endRecord = data.indexOf("}");
      let record = data.substring(startRecord, endRecord + 1);
      data = data.replace("{", "");
      data = data.replace("}", "");
      let dataParsed = JSON.parse(record);
      let text = document.createElement("p");
      text.innerHTML = dataParsed.firstName + "  |  " + dataParsed.lastName + "  |  " +
        dataParsed.email + "  |  " + dataParsed.userName + "  |  " + dataParsed.age + "  |  " +
        dataParsed.personality;
      regularDashboard.appendChild(text);
    }
  }, "role=R");

  ajaxPOST("/userInfo", function printAdmin(data) {
    while (data.indexOf("{") > 0) {
      let startRecord = data.indexOf("{");
      let endRecord = data.indexOf("}");
      let record = data.substring(startRecord, endRecord + 1);
      data = data.replace("{", "");
      data = data.replace("}", "");
      let dataParsed = JSON.parse(record);
      let text = document.createElement("p");
      text.innerHTML = dataParsed.firstName + "  |  " + dataParsed.lastName + "  |  " +
        dataParsed.email + "  |  " + dataParsed.userName + "  |  " + dataParsed.age + "  |  " +
        dataParsed.personality;
      admindashboard.appendChild(text);
    }
  }, "role=A");

  document.querySelector("#LogOut").addEventListener("click", function(e) {
    e.preventDefault();
    localStorage.removeItem("AudioCave_Email");
    localStorage.removeItem("AudioCave_Password");
    window.location.replace("/logout");
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