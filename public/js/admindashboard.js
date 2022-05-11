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

  ajaxPOST("/userInfo", printUser, "role=R");
  ajaxPOST("/userInfo", printUser, "role=A");

  function printUser(data){
    while (data.indexOf("{") > 0) {
      let startRecord = data.indexOf("{");
      let endRecord = data.indexOf("}");
      let record = data.substring(startRecord, endRecord + 1);
      data = data.replace("{", "");
      data = data.replace("}", "");
      let dataParsed = JSON.parse(record);
      const dashboard = dataParsed.role == "A" ? document.querySelector("#adminInfo") : document.querySelector("#regularInfo");
      let userRecord = document.createElement("div");
      let text = document.createElement("p");
      let editUserButton = document.createElement("span");
      editUserButton.classList.add("material-symbols-outlined");
      editUserButton.innerHTML = "edit";
      let deleteUserButton = document.createElement("span");
      deleteUserButton.classList.add("material-symbols-outlined");
      deleteUserButton.innerHTML = "delete";
      text.innerHTML = dataParsed.firstName + "  |  " + dataParsed.lastName + "  |  " +
        dataParsed.email + "  |  " + dataParsed.password + "  |  " + dataParsed.role + "  |  " + dataParsed.userName + 
        "  |  " + dataParsed.age + "  |  " +
        dataParsed.personality + " ";

      // Edit User
      editUserButton.onclick = function(event){
        event.preventDefault();

        let fname = document.createElement("input");
        fname.placeholder = "First Name";
        fname.value = dataParsed.firstName;
        fname.style.width = fname.value.length + "em";
        let lname = document.createElement("input");
        lname.placeholder = "Last Name";
        lname.value = dataParsed.lastName;
        lname.style.width = lname.value.length + "em";
        let email = document.createElement("input");
        email.placeholder = "Email";
        email.value = dataParsed.email;
        email.style.width = email.value.length + "em";
        let password = document.createElement("input");
        password.placeholder = "Password";
        password.value = dataParsed.password;
        password.style.width = password.value.length + "em";
        let role = document.createElement("select");
        role.innerHTML = "<option value='A'>Admin</option>" + 
                         "\n<option value='R'>Regular</option>";
        role.value = dataParsed.role;
        let uname = document.createElement("input");
        uname.placeholder = "Username";
        uname.value = dataParsed.userName;
        uname.style.width = uname.value.length + "em";
        let age = document.createElement("input");
        age.placeholder = "age";
        age.type = "number";
        age.min = 1;
        age.max = 150;
        age.value = dataParsed.age;
        age.style.width = age.value.length + 1 + "em";
        let personality = document.createElement("select");
        personality.innerHTML = "<option value='ESTJ'>ESTJ</option>" +
                                "<option value='ENTJ'>ENTJ</option>" +
                                "<option value='ESFJ'>ESFJ</option>" +
                                "<option value='ENFJ'>ENFJ</option>" +
                                "<option value='ISTJ'>ISTJ</option>" +
                                "<option value='ISFJ'>ISFJ</option>" +
                                "<option value='INTJ'>INTJ</option>" +
                                "<option value='INFJ'>INFJ</option>" +
                                "<option value='ESTP'>ESTP</option>" +
                                "<option value='ESFP'>ESFP</option>" +
                                "<option value='ENTP'>ENTP</option>" +
                                "<option value='ENFP'>ENFP</option>" +
                                "<option value='ISTP'>ISTP</option>" +
                                "<option value='ISFP'>ISFP</option>" +
                                "<option value='INTP'>INTP</option>" +
                                "<option value='INFP'>INFP</option>"
        personality.value = dataParsed.personality;
        let confirm = document.createElement("span");
        confirm.classList.add("material-symbols-outlined");
        confirm.innerHTML = "done";
        let cancel = document.createElement("span");
        cancel.classList.add("material-symbols-outlined");
        cancel.innerHTML = "close";

        userRecord.innerHTML = "";
        userRecord.appendChild(fname);
        userRecord.appendChild(lname);
        userRecord.appendChild(email);
        userRecord.appendChild(password);
        userRecord.appendChild(role);
        userRecord.appendChild(uname);
        userRecord.appendChild(age);
        userRecord.appendChild(personality);
        userRecord.appendChild(confirm);
        userRecord.appendChild(cancel);

        // Submit New User Data
        confirm.onclick = function(event){
          event.preventDefault();
          let queryString = "fname=" + fname.value + "&lname=" + lname.value + "&email=" + dataParsed.email
            + "&password=" + password.value + "&role=" + role.value + "&username=" + uname.value
            + "&age=" + age.value + "&mbti=" + personality.value + "&newEmail=" + email.value;
          ajaxPOST("/editUser", function(data){
            if (data) {
              let dataParsed = JSON.parse(data);
              console.log(dataParsed);
              if (dataParsed.status == "fail") {
                document.getElementById("errorMsg").innerHTML = dataParsed.msg;
              } else {
                location.reload();
              }
            }
          }, queryString);
        };

        // Cancel User Data Editing
        cancel.onclick = function(event){
          event.preventDefault();
          location.reload();
        };
      };

      //Delete User
      deleteUserButton.onclick = function(event){
        event.preventDefault();
        let queryString = "email=" + dataParsed.email + "&role=" + dataParsed.role;
        ajaxPOST("/deleteUser", function(data){
          if (data) {
            let dataParsed = JSON.parse(data);
            console.log(dataParsed);
            if (dataParsed.status == "fail") {
              document.getElementById("errorMsg").innerHTML = dataParsed.msg;
            } else {
              location.reload();
            }
          }
        }, queryString);
      };

      dashboard.appendChild(userRecord);
      userRecord.appendChild(text);
      userRecord.appendChild(editUserButton);
      userRecord.appendChild(deleteUserButton);
    }
  }

  document.querySelector("#LogOut").addEventListener("click", function(e) {
    e.preventDefault();
    localStorage.removeItem("AudioCave_Email");
    localStorage.removeItem("AudioCave_Password");
    window.location.replace("/logout");
  })

  document.querySelector("#submitUser").addEventListener("click", function(e){
    e.preventDefault();
    let email = document.getElementById("addEmail");
    let password = document.getElementById("addPassword");
    let fname = document.getElementById("addFirstName");
    let lname = document.getElementById("addLastName");
    let username = document.getElementById("addUserName");
    let age = document.getElementById("addAge");
    let mbti = document.getElementById("addPersonality");
    let role = document.getElementById("addRole");

    let queryString = "email=" + email.value + "&password=" + password.value + "&fname=" 
      + fname.value + "&lname=" + lname.value + "&username=" + username.value + "&mbti=" 
      + mbti.value + "&age=" + age.value + "&role=" + role.value;
    
    ajaxPOST("/addUser", function(data) {

      if (data) {
        let dataParsed = JSON.parse(data);
        console.log(dataParsed);
        if (dataParsed.status == "fail") {
          document.getElementById("errorMsg").innerHTML = dataParsed.msg;
        } else {
          location.reload();
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