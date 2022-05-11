"use strict";
const { strict } = require("assert");
const express = require("express");
const session = require("express-session");
const app = express();
const fs = require("fs");
const { connect } = require("http2");
const { JSDOM } = require("jsdom");
const multer = require("multer");

// static path mappings
app.use("/js", express.static("public/js"));
app.use("/css", express.static("public/css"));
app.use("/img", express.static("public/img"));
app.use("/fonts", express.static("public/font"));
app.use("/html", express.static("public/html"));
app.use("/media", express.static("public/media"));
app.use("/upload", express.static("public/upload"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "comp2800",
});

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/upload/")
  },
  filename: function (req, file, callback) {
    callback(null, "my-app-" + file.originalname.split('/').pop().trim());
  }
});
const upload = multer({ storage: storage });

app.use(
  session({
    secret: "extra text that no one will guess",
    name: "wazaSessionID",
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", function (req, res) {
  if (req.session.loggedIn) {
    if (req.session.role == "A") {
      res.redirect("/admindashboard");
    } else {
      res.redirect("/main");
    }
  } else {
    let doc = fs.readFileSync("./public/html/login.html", "utf8");

    res.set("Server", "Wazubi Engine");
    res.set("X-Powered-By", "Wazubi");
    res.send(doc);
  }
});

app.get("/signup", function (req, res) {
  {
    let signup = fs.readFileSync("./public/html/signup.html", "utf8");
    let signupDOM = new JSDOM(signup);
    res.set("Server", "Wazubi Engine");
    res.set("X-Powered-By", "Wazubi");
    res.send(signupDOM.serialize());
  }
});

app.get("/main", function (req, res) {
  // check for a session first!
  if (req.session.loggedIn) {
    let main = fs.readFileSync("./public/html/main.html", "utf8");
    let mainDOM = new JSDOM(main);
    res.set("Server", "Wazubi Engine");
    res.set("X-Powered-By", "Wazubi");
    res.send(mainDOM.serialize());
  } else {
    // not logged in - no session and no access, redirect to home!
    res.redirect("/");
  }
});

app.get("/admindashboard", function (req, res) {
  // check for a session first!
  if (req.session.loggedIn) {
    let main = fs.readFileSync("./public/html/admindashboard.html", "utf8");
    let mainDOM = new JSDOM(main);
    res.set("Server", "Wazubi Engine");
    res.set("X-Powered-By", "Wazubi");
    res.send(mainDOM.serialize());
  } else {
    // not logged in - no session and no access, redirect to home!
    res.redirect("/");
  }
});

app.get("/userprofile", function (req, res) {
  if (req.session.loggedIn) {
    let main = fs.readFileSync("./public/html/userprofile.html", "utf8");
    let mainDOM = new JSDOM(main);
    const mysql = require("mysql2");
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "comp2800",
    });
    connection.connect();
    connection.query(
      "SELECT * FROM bby_8_user WHERE ID = ?",
      [req.session.number],
      function (error, results) {
        console.log(results);
        var username = results[0].userName;
        var password = results[0].password;
        var email = results[0].email;
        var age = results[0].age;
        if (results[0].filesrc != "default") {
          var profilePicture = "/upload/" + results[0].filesrc;
          console.log(profilePicture);
          mainDOM.window.document.getElementById("profile-picture").setAttribute("src", profilePicture);
        }
        mainDOM.window.document.getElementById("username").setAttribute("value", username);
        mainDOM.window.document.getElementById("email").setAttribute("value", email);
        mainDOM.window.document.getElementById("password").setAttribute("value", password);
        mainDOM.window.document.getElementById("age").setAttribute("value", age);

        res.set("Server", "Wazubi Engine");
        res.set("X-Powered-By", "Wazubi");
        res.send(mainDOM.serialize());
      }
    )
  } else {
    // not logged in - no session and no access, redirect to home!
    res.redirect("/");
  }
});

app.get("/survey", function (req, res) {
  // check for a session first!
  if (req.session.loggedIn) {
    let main = fs.readFileSync("./public/html/survey.html", "utf8");
    let mainDOM = new JSDOM(main);
    res.set("Server", "Wazubi Engine");
    res.set("X-Powered-By", "Wazubi");
    res.send(mainDOM.serialize());
  } else {
    // not logged in - no session and no access, redirect to home!
    res.redirect("/");
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Notice that this is a "POST"
app.post("/login", function (req, res) {
  res.setHeader("Content-Type", "application/json");

  console.log("What was sent", req.body.email, req.body.password);

  let results = authenticate(
    req.body.email,
    req.body.password,
    function (userRecord) {
      //console.log(rows);
      if (userRecord == null) {
        // server couldn't find that, so use AJAX response and inform
        // the user. when we get success, we will do a complete page
        // change. Ask why we would do this in lecture/lab :)
        res.send({ status: "fail", msg: "User account not found." });
      } else {
        // authenticate the user, create a session
        req.session.loggedIn = true;
        req.session.number = userRecord.ID;
        req.session.email = userRecord.email;
        req.session.firstName = userRecord.firstName;
        req.session.lastName = userRecord.lastName;
        req.session.userName = userRecord.userName;
        req.session.age = userRecord.age;
        req.session.role = userRecord.role;
        req.session.password = userRecord.password;
        req.session.save(function (err) { });
        res.send({
          status: "success",
          msg: "Logged in.",
          role: userRecord.role,
        });
      }
    }
  );
});

app.post("/signup", function (req, res) {
  var mysql = require("mysql2");
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
  });
  var fname = req.body.fname;
  var lname = req.body.lname;
  var email = req.body.email;
  var password = req.body.password;
  var username = req.body.username;
  var mbti = req.body.mbti;
  var age = req.body.age;
  var filesrc = "default";

  connection.connect(function (err) {
    if (err) throw err;
    var sql = "SELECT * FROM bby_8_user WHERE email =?";
    connection.query(sql, email, function (err, data, fields) {
      if (err) throw err;
      if (data.length > 1) {
        res.setHeader("Content-Type", "application/json");
        res.send({ status: "fail", msg: "Email already exists." });
      } else {
        var sql =
          "INSERT INTO bby_8_user (firstName, lastname, email, password, role, userName, age, personality, filesrc) VALUES ('" + fname + "', '" + lname + "', '" + email + "', '" + password + "', 'R', '" + username + "', '" + age + "', '" + mbti + "', '" + filesrc + "')";
        connection.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
          res.setHeader("Content-Type", "application/json");
          res.send({ status: "success" });
        });
      }
    });
  });
});

app.post("/updateprofile", function (req, res) {
  connection.connect(function (err) {
    if (err) throw err;
    connection.query(
      "UPDATE bby_8_user SET email = ?, password = ?, username = ?, age = ? WHERE ID = ?",
      [req.body.email, req.body.password, req.body.username, req.body.age, req.session.number],
      function (error, results, fields) {
        if (error) {
          console.log(error);
        }
        console.log("profile updated")
        res.setHeader("Content-Type", "application/json");
        res.send({ status: "success", msg: "profile updated." });
      }
    );
    connection.end();
  });
});

app.post("/userInfo", function (req, res) {
  let results = getUserInfo(req.body.role, function (userRecords) {
    res.send(userRecords);
  });
});

app.post('/upload-images', upload.array("files"), function (req, res) {
  console.log(req.files);
  const mysql = require("mysql2");
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
  });
  connection.connect();
  connection.query(
    "UPDATE bby_8_user SET filesrc = ? WHERE ID = ?",
    [req.files[0].filename, req.session.number],
    function (error, results, fields) {
      if (error) {
        console.log(error);
      }
      console.log("profile picture updated")
      res.setHeader("Content-Type", "application/json");
      res.send({ status: "success", msg: "profile picture updated." });
    }
  );
  connection.end();
  for (let i = 0; i < req.files.length; i++) {
    req.files[i].filename = req.files[i].originalname;
  }
});

app.get("/logout", function (req, res) {
  if (req.session) {
    req.session.destroy(function (error) {
      if (error) {
        res.status(400).send("Unable to log out");
      } else {
        res.redirect("/");
      }
    });
  }
});

app.post("/addUser", function (req, res) {
  const mysql = require("mysql2");
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
  });

  let fname = req.body.fname;
  let lname = req.body.lname;
  let email = req.body.email;
  let password = req.body.password;
  let username = req.body.username;
  let mbti = req.body.mbti;
  let age = req.body.age;
  let role = req.body.role;

  connection.connect(function (err) {
    if (err) throw err;
    var sql = "SELECT * FROM bby_8_user WHERE email =?";
    connection.query(sql, email, function (err, data, fields) {
      if (err) throw err;
      if (data.length > 0) {
        res.setHeader("Content-Type", "application/json");
        res.send({ status: "fail", msg: "Email already exists." });
      } else {
        let sql = "INSERT INTO bby_8_user (firstName, lastname, email, password, role, userName, age, personality) VALUES ('"
          + fname + "', '" + lname + "', '" + email + "', '" + password + "', '" + role + "', '" + username + "', '"
          + age + "', '" + mbti + "')"
        connection.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
          res.setHeader("Content-Type", "application/json");
          res.send({ status: "success" });
        });
      }
    })
  });
});

app.post("/deleteUser", function (req, res) {
  const mysql = require("mysql2");
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
  });
  connection.connect(function (err) {
    if (err) throw err;
    var sql = "SELECT * FROM bby_8_user WHERE role =?";
    connection.query(sql, req.body.role, function (err, data, fields) {
      if (err) throw err;
      if (data.length <= 1 && req.body.role == "A") {
        res.setHeader("Content-Type", "application/json");
        res.send({ status: "fail", msg: "At least one admin needed." });
      } else {
        let sql = "DELETE FROM bby_8_user WHERE email = '" + req.body.email + "'";
        connection.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record deleted");
          res.setHeader("Content-Type", "application/json");
          res.send({ status: "success" });
        });
      }
    })
  });
});

app.post("/editUser", function (req, res) {
  const mysql = require("mysql2");
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
  });

  let fname = req.body.fname;
  let lname = req.body.lname;
  let email = req.body.email;
  let newEmail = req.body.newEmail;
  let password = req.body.password;
  let username = req.body.username;
  let mbti = req.body.mbti;
  let age = req.body.age;
  let role = req.body.role;

  connection.connect(function (err) {
    if (err) throw err;
    var sql = "SELECT * FROM bby_8_user WHERE email =?";
    connection.query(sql, newEmail, function (err, data, fields) {
      if (err) throw err;
      if (data.length > 0 && email != newEmail) {
        res.setHeader("Content-Type", "application/json");
        res.send({ status: "fail", msg: "Email already exists." });
      } else {
        let sql = "UPDATE bby_8_user SET firstName='" + fname + "', lastName='" + lname + "', email='"
          + newEmail + "', password='" + password + "', role='" + role + "', userName='" + username
          + "', age='" + age + "', personality='" + mbti + "' WHERE email='" + email + "'";
        connection.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record updated");
          res.setHeader("Content-Type", "application/json");
          res.send({ status: "success" });
        });
      }
    })
  });
});

app.post("/daily-survey", function (req, res) {
  var mysql = require("mysql2");
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
  });
  console.log(req.body.mood);
  connection.connect();
  var sql = "SELECT * FROM bby_8_survey WHERE userID =? AND dateOfSurvey =?";
  connection.query(sql, [req.session.number, req.body.date], function (err, data, fields) {
    if (err) throw err;
    if (data.length > 0) {
      var sql = "UPDATE bby_8_survey SET survey= '" + req.body.mood + "' WHERE userID= '" + req.session.number + "' AND dateOfSurvey= '" + req.body.date + "'";
      connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Survey record updated");
        res.setHeader("Content-Type", "application/json");
        res.send({ status: "success" });
      })
    } else {
      var sql = "INSERT INTO bby_8_survey (userID, dateOfSurvey, survey) VALUES ('" + req.session.number + "', '" + req.body.date + "', '" + req.body.mood + "')";
      connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Survey Taken");
        res.setHeader("Content-Type", "application/json");
        res.send({ status: "success" })
      })
    }
  })
})

function authenticate(email, pwd, callback) {
  const mysql = require("mysql2");
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
  });
  connection.connect();
  connection.query(
    "SELECT * FROM bby_8_user WHERE email = ? AND password = ?",
    [email, pwd],
    function (error, results, fields) {
      // results is an array of records, in JSON format
      // fields contains extra meta data about results
      console.log(
        "Results from DB",
        results,
        "and the # of records returned",
        results.length
      );

      if (error) {
        // in production, you'd really want to send an email to admin but for now, just console
        console.log(error);
      }
      if (results.length > 0) {
        // email and password found
        return callback(results[0]);
      } else {
        // user not found
        return callback(null);
      }
    }
  );
}

function getUserInfo(userType, callback) {
  const mysql = require("mysql2");
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
  });
  connection.connect();
  connection.query(
    "SELECT * FROM bby_8_user WHERE role = ?",
    [userType],
    function (error, results, fields) {
      // results is an array of records, in JSON format
      // fields contains extra meta data about results
      if (error) {
        console.log(error);
      }
      if (results.length > 0) {
        return callback(results);
      } else {
        // user not found
        return callback([]);
      }
    }
  );
}

// RUN SERVER
let port = 8000;
app.listen(port);
console.log("Listening on port " + port + "!");
