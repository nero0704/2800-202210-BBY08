"use strict";
const { strict, fail } = require("assert");
const { text } = require("express");
const express = require("express");
const session = require("express-session");
const res = require("express/lib/response");
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

const isHeroku = process.env.IS_HEROKU || false;

const mysql = require("mysql2");
const connection = isHeroku ? mysql.createConnection({
  host: "ble5mmo2o5v9oouq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  user: "xu76mlcd3o67jwnx",
  password: "xhqasmzcj6v8di7m",
  database: "zyt8w00z5yriluwj",
}) : mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "comp2800",
});

const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./public/upload/")
  },
  filename: function(req, file, callback) {
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

app.get("/", function(req, res) {
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

app.get("/signup", function(req, res) {
  {
    let signup = fs.readFileSync("./public/html/signup.html", "utf8");
    let signupDOM = new JSDOM(signup);
    res.set("Server", "Wazubi Engine");
    res.set("X-Powered-By", "Wazubi");
    res.send(signupDOM.serialize());
  }
});

app.get("/main", function(req, res) {
  if (req.session.loggedIn) {
    let main = fs.readFileSync("./public/html/main.html", "utf8");
    let mainDOM = new JSDOM(main);
    res.set("Server", "Wazubi Engine");
    res.set("X-Powered-By", "Wazubi");
    res.send(mainDOM.serialize());
  } else {
    res.redirect("/");
  }
});

app.get("/admindashboard", function(req, res) {
  if (req.session.loggedIn) {
    let main = fs.readFileSync("./public/html/admindashboard.html", "utf8");
    let mainDOM = new JSDOM(main);
    res.set("Server", "Wazubi Engine");
    res.set("X-Powered-By", "Wazubi");
    res.send(mainDOM.serialize());
  } else {
    res.redirect("/");
  }
});

app.get("/userprofile", function(req, res) {
  if (req.session.loggedIn) {
    let main = fs.readFileSync("./public/html/userprofile.html", "utf8");
    let mainDOM = new JSDOM(main);
    const mysql = require("mysql2");
    const connection = isHeroku ? mysql.createConnection({
      host: "ble5mmo2o5v9oouq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      user: "xu76mlcd3o67jwnx",
      password: "xhqasmzcj6v8di7m",
      database: "zyt8w00z5yriluwj",
    }) : mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "comp2800",
    });
    connection.connect();
    connection.query(
      "SELECT * FROM BBY_8_user WHERE ID = ?", [req.session.number],
      function(error, results) {
        var username = results[0].userName;
        var password = results[0].password;
        var email = results[0].email;
        var age = results[0].age;
        if (results[0].filesrc != "default") {
          var profilePicture = "/upload/" + results[0].filesrc;
          mainDOM.window.document.getElementById("profile-picture").querySelector("img").setAttribute("src", profilePicture);
        }
        mainDOM.window.document.querySelector("#username h1").innerHTML = username;
        mainDOM.window.document.querySelector("#email h1").innerHTML = email;
        mainDOM.window.document.querySelector("#password h1").innerHTML = password;
        mainDOM.window.document.querySelector("#age h1").innerHTML = age;

        res.set("Server", "Wazubi Engine");
        res.set("X-Powered-By", "Wazubi");
        res.send(mainDOM.serialize());
      }
    )
  } else {
    res.redirect("/");
  }
});

app.get("/songinfo", function(req, res) {
  if (req.session.loggedIn) {
    let main = fs.readFileSync("./public/html/songinfo.html", "utf8");
    let mainDOM = new JSDOM(main);
    res.set("Server", "Wazubi Engine");
    res.set("X-Powered-By", "Wazubi");
    res.send(mainDOM.serialize());
  } else {
    res.redirect("/");
  }
});

app.get("/survey", function(req, res) {
  if (req.session.loggedIn) {
    let main = fs.readFileSync("./public/html/survey.html", "utf8");
    let mainDOM = new JSDOM(main);
    res.set("Server", "Wazubi Engine");
    res.set("X-Powered-By", "Wazubi");
    res.send(mainDOM.serialize());
  } else {
    res.redirect("/");
  }
});

app.get("/library", function (req, res) {
  if (req.session.loggedIn) {
    let main = fs.readFileSync("./public/html/library.html", "utf8");
    let mainDOM = new JSDOM(main);
    res.set("Server", "Wazubi Engine");
    res.set("X-Powered-By", "Wazubi");
    res.send(mainDOM.serialize());
  } else {
    res.redirect("/");
  }
});

app.get("/new", function (req, res) {
  if (req.session.loggedIn) {
    let main = fs.readFileSync("./public/html/newalbums.html", "utf8");
    let mainDOM = new JSDOM(main);
    res.set("Server", "Wazubi Engine");
    res.set("X-Powered-By", "Wazubi");
    res.send(mainDOM.serialize());
  } else {
    res.redirect("/");
  }
});

app.get("/search", function (req, res) {
  if (req.session.loggedIn) {
    let main = fs.readFileSync("./public/html/search.html", "utf8");
    let mainDOM = new JSDOM(main);
    res.set("Server", "Wazubi Engine");
    res.set("X-Powered-By", "Wazubi");
    res.send(mainDOM.serialize());
  } else {
    res.redirect("/");
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/login", function(req, res) {
  res.setHeader("Content-Type", "application/json");

  let results = authenticate(
    req.body.email,
    req.body.password,
    function(userRecord) {
      if (userRecord == null) {
        res.send({ status: "fail", msg: "User account not found." });
      } else {
        req.session.loggedIn = true;
        req.session.number = userRecord.ID;
        req.session.email = userRecord.email;
        req.session.firstName = userRecord.firstName;
        req.session.lastName = userRecord.lastName;
        req.session.userName = userRecord.userName;
        req.session.age = userRecord.age;
        req.session.role = userRecord.role;
        req.session.password = userRecord.password;
        req.session.mbti = userRecord.personality;
        req.session.save(function(err) {});
        res.send({
          status: "success",
          msg: "Logged in.",
          role: userRecord.role,
        });
      }
    }
  );
});

app.post("/signup", function(req, res) {
  var mysql = require("mysql2");
  const connection = isHeroku ? mysql.createConnection({
    host: "ble5mmo2o5v9oouq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "xu76mlcd3o67jwnx",
    password: "xhqasmzcj6v8di7m",
    database: "zyt8w00z5yriluwj",
  }) : mysql.createConnection({
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

  connection.connect(function(err) {
    if (err) throw err;
    var sql = "SELECT * FROM BBY_8_user WHERE email =?";
    connection.query(sql, email, function(err, data, fields) {
      if (err) throw err;
      if (data.length > 1) {
        res.setHeader("Content-Type", "application/json");
        res.send({ status: "fail", msg: "Email already exists." });
      } else if (fname.trim().length <= 0 || lname.trim().length <= 0 || email.trim().length <= 0 ||
        password.trim().length <= 0 || username.trim().length <= 0 || mbti.trim().length <= 0 || age.trim().length <= 0) {
        res.setHeader("Content-Type", "application/json");
        res.send({ status: "fail", msg: "Missing Information." });
      } else {
        var sql =
          "INSERT INTO BBY_8_user (firstName, lastname, email, password, role, userName, age, personality, filesrc) VALUES ('" + fname + "', '" + lname + "', '" + email + "', '" + password + "', 'R', '" + username + "', '" + age + "', '" + mbti + "', '" + filesrc + "')";
        connection.query(sql, function(err, result) {
          if (err) throw err;
          res.setHeader("Content-Type", "application/json");
          res.send({ status: "success" });
        });
      }
    });
  });
});

app.post("/updateprofile", function(req, res) {
  const connection = isHeroku ? mysql.createConnection({
    host: "ble5mmo2o5v9oouq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "xu76mlcd3o67jwnx",
    password: "xhqasmzcj6v8di7m",
    database: "zyt8w00z5yriluwj",
  }) : mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
  });
  connection.connect(function(err) {
    if (err) throw err;
    connection.query(
      "UPDATE BBY_8_user SET email = ?, password = ?, username = ?, age = ? WHERE ID = ?", [req.body.email, req.body.password, req.body.username, req.body.age, req.session.number],
      function(error, results, fields) {
        if (error) {
          throw error;
        }
        res.setHeader("Content-Type", "application/json");
        res.send({ status: "success", msg: "profile updated." });
      }
    );
    connection.end();
  });
});

app.post("/userInfo", function(req, res) {
  let results = getUserInfo(req.body.role, function(userRecords) {
    res.send(userRecords);
  });
});

app.post('/upload-images', upload.array("files"), function(req, res) {
  const mysql = require("mysql2");
  const connection = isHeroku ? mysql.createConnection({
    host: "ble5mmo2o5v9oouq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "xu76mlcd3o67jwnx",
    password: "xhqasmzcj6v8di7m",
    database: "zyt8w00z5yriluwj",
  }) : mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
  });
  connection.connect();
  connection.query(
    "UPDATE BBY_8_user SET filesrc = ? WHERE ID = ?", [req.files[0].filename, req.session.number],
    function(error, results, fields) {
      if (error) {
        throw error;
      }
      res.setHeader("Content-Type", "application/json");
      res.send({ status: "success", msg: "profile picture updated." });
    }
  );
  connection.end();
  for (let i = 0; i < req.files.length; i++) {
    req.files[i].filename = req.files[i].originalname;
  }
});

app.get("/logout", function(req, res) {
  if (req.session) {
    req.session.destroy(function(error) {
      if (error) {
        res.status(400).send("Unable to log out");
      } else {
        res.redirect("/");
      }
    });
  }
});

app.post("/addUser", function(req, res) {
  const mysql = require("mysql2");
  const connection = isHeroku ? mysql.createConnection({
    host: "ble5mmo2o5v9oouq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "xu76mlcd3o67jwnx",
    password: "xhqasmzcj6v8di7m",
    database: "zyt8w00z5yriluwj",
  }) : mysql.createConnection({
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

  connection.connect(function(err) {
    if (err) throw err;
    var sql = "SELECT * FROM BBY_8_user WHERE email =?";
    connection.query(sql, email, function(err, data, fields) {
      if (err) throw err;
      if (data.length > 0) {
        res.setHeader("Content-Type", "application/json");
        res.send({ status: "fail", msg: "Email already exists." });
      } else if (fname.trim().length <= 0 || lname.trim().length <= 0 || email.trim().length <= 0 ||
        password.trim().length <= 0 || username.trim().length <= 0 || mbti.trim().length <= 0 || age.trim().length <= 0) {
        res.setHeader("Content-Type", "application/json");
        res.send({ status: "fail", msg: "Missing Information." });
      } else {
        let sql = "INSERT INTO BBY_8_user (firstName, lastname, email, password, role, userName, age, personality, filesrc) VALUES ('" +
          fname + "', '" + lname + "', '" + email + "', '" + password + "', '" + role + "', '" + username + "', '" +
          age + "', '" + mbti + "', 'default')";
        connection.query(sql, function(err, result) {
          if (err) throw err;
          res.setHeader("Content-Type", "application/json");
          res.send({ status: "success" });
        });
      }
    })
  });
});

app.post("/deleteUser", function(req, res) {
  const mysql = require("mysql2");
  const connection = isHeroku ? mysql.createConnection({
    host: "ble5mmo2o5v9oouq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "xu76mlcd3o67jwnx",
    password: "xhqasmzcj6v8di7m",
    database: "zyt8w00z5yriluwj",
  }) : mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
  });
  connection.connect(function(err) {
    if (err) throw err;
    var sql = "SELECT * FROM BBY_8_user WHERE role =?";
    connection.query(sql, req.body.role, function(err, data, fields) {
      if (err) throw err;
      if (data.length <= 1 && req.body.role == "A") {
        res.setHeader("Content-Type", "application/json");
        res.send({ status: "fail", msg: "At least one admin needed." });
      } else {
        let sql = "DELETE FROM BBY_8_user WHERE email = '" + req.body.email + "'";
        connection.query(sql, function(err, result) {
          if (err) throw err;
          res.setHeader("Content-Type", "application/json");
          res.send({ status: "success" });
        });
      }
    })
  });
});

app.post("/editUser", function(req, res) {
  const mysql = require("mysql2");
  const connection = isHeroku ? mysql.createConnection({
    host: "ble5mmo2o5v9oouq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "xu76mlcd3o67jwnx",
    password: "xhqasmzcj6v8di7m",
    database: "zyt8w00z5yriluwj",
  }) : mysql.createConnection({
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

  connection.connect(function(err) {
    if (err) throw err;
    var sql = "SELECT * FROM BBY_8_user WHERE email =?";
    connection.query(sql, newEmail, function(err, data, fields) {
      if (err) throw err;
      if (data.length > 0 && email != newEmail) {
        res.setHeader("Content-Type", "application/json");
        res.send({ status: "fail", msg: "Email already exists." });
      } else {
        let sql = "UPDATE BBY_8_user SET firstName='" + fname + "', lastName='" + lname + "', email='" +
          newEmail + "', password='" + password + "', role='" + role + "', userName='" + username +
          "', age='" + age + "', personality='" + mbti + "' WHERE email='" + email + "'";
        connection.query(sql, function(err, result) {
          if (err) throw err;
          res.setHeader("Content-Type", "application/json");
          res.send({ status: "success" });
        });
      }
    })
  });
});

app.post("/get-suggestions", function(req, res) {
  connection.connect(function(err) {
    var sql = "SELECT * FROM bby_8_survey WHERE userID =? AND dateOfSurvey =?";
    connection.query(sql, [req.session.number, req.body.date], function(err, data, fields) {
      if (data.length > 0) {
        var sql = "SELECT * FROM bby_8_song WHERE mood IN (SELECT survey FROM bby_8_survey WHERE userID =? AND dateOfSurvey =?) ORDER BY RAND() LIMIT 5";
        connection.query(sql, [req.session.number, req.body.date], function(err, results) {
          res.send({ status: "success", rows: results });
        });
      } else {
        var sql = "SELECT * FROM bby_8_song WHERE personality IN (SELECT personality FROM bby_8_user WHERE ID =?) ORDER BY RAND() LIMIT 5";
        connection.query(sql, req.session.number, function(err, results) {
          res.send({ status: "success", rows: results });
        });
      }
    })
  })
});

app.post("/get-song-info", function(req, res) {
  connection.connect(function(err) {
    var sql = "SELECT * FROM bby_8_song WHERE ID=?";
    connection.query(sql, [req.body.songID], function(err, data, fields) {
      if (data.length > 0) {
        res.send({ status: "success", rows: data });
      } else {
        res.send({ status: "failed" });
      }
    })
  })
});

app.post("/daily-survey", function(req, res) {
  var mysql = require("mysql2");
  const connection = isHeroku ? mysql.createConnection({
    host: "ble5mmo2o5v9oouq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "xu76mlcd3o67jwnx",
    password: "xhqasmzcj6v8di7m",
    database: "zyt8w00z5yriluwj",
  }) : mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
  });
  connection.connect();
  var sql = "SELECT * FROM bby_8_survey WHERE userID =? AND dateOfSurvey =?";
  connection.query(sql, [req.session.number, req.body.date], function(err, data, fields) {
    if (err) throw err;
    if (data.length > 0) {
      var sql = "UPDATE bby_8_survey SET survey= '" + req.body.mood + "' WHERE userID= '" + req.session.number + "' AND dateOfSurvey= '" + req.body.date + "'";
      connection.query(sql, function(err, result) {
        if (err) throw err;
        res.setHeader("Content-Type", "application/json");
        res.send({ status: "success" });
      })
    } else {
      var sql = "INSERT INTO bby_8_survey (userID, dateOfSurvey, survey) VALUES ('" + req.session.number + "', '" + req.body.date + "', '" + req.body.mood + "')";
      connection.query(sql, function(err, result) {
        if (err) throw err;
        res.setHeader("Content-Type", "application/json");
        res.send({ status: "success" });
      })
    }
  })
});

app.post("/reviewSong", function(req, res) {
  var mysql = require("mysql2");
  const connection = isHeroku ? mysql.createConnection({
    host: "ble5mmo2o5v9oouq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "xu76mlcd3o67jwnx",
    password: "xhqasmzcj6v8di7m",
    database: "zyt8w00z5yriluwj",
  }) : mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
  });

  const userID = req.session.number;
  const songID = req.body.song;
  const dateOfReview = req.body.date;
  const review = req.body.review;

  connection.connect();
  var sql = "SELECT * FROM bby_8_review WHERE userID =? AND songID =?";
  connection.query(sql, [userID, songID], function(err, data, fields) {
    if (err) throw err;
    if (data.length > 0) { // The user has reviewed this song before
      res.setHeader("Content-Type", "application/json");
      res.send({ status: "fail", msg: "Can't review song more than once (Edit past review instead)" });
    } else if (review.trim().length <= 0) {
      res.setHeader("Content-Type", "application/json");
      res.send({ status: "fail", msg: "Review can't be empty" });
    } else {
      var sql = "INSERT INTO BBY_8_review (userID, songID, dateOfReview, review) VALUES ('" +
        userID + "', '" + songID + "', '" + dateOfReview + "', '" + review + "')";
      connection.query(sql, function(err, result) {
        if (err) throw err;
        res.setHeader("Content-Type", "application/json");
        res.send({ status: "success" });
      })
    }
  })
});

app.post("/displayUserReview", function(req, res) {
  var mysql = require("mysql2");
  const connection = isHeroku ? mysql.createConnection({
    host: "ble5mmo2o5v9oouq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "xu76mlcd3o67jwnx",
    password: "xhqasmzcj6v8di7m",
    database: "zyt8w00z5yriluwj",
  }) : mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
  });

  const userID = req.session.number;
  const songID = req.body.song;

  connection.connect();
  var sql = "SELECT u.userName, r.review FROM bby_8_user u, bby_8_review  r WHERE r.userID = ? AND r.songID = ? AND r.userID = u.ID";
  connection.query(sql, [userID, songID], function(err, data, fields) {
    if (err) throw err;
    if (data.length == 1) {
      res.setHeader("Content-Type", "application/json");
      res.send(data[0]);
    } else {
      res.setHeader("Content-Type", "application/json");
      res.send({ status: "fail" });
    }
  })
});

app.post("/displayOtherReviews", function(req, res) {
  var mysql = require("mysql2");
  const connection = isHeroku ? mysql.createConnection({
    host: "ble5mmo2o5v9oouq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "xu76mlcd3o67jwnx",
    password: "xhqasmzcj6v8di7m",
    database: "zyt8w00z5yriluwj",
  }) : mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
  });

  const userID = req.session.number;
  const songID = req.body.song;

  connection.connect();
  var sql = "SELECT u.userName, r.review FROM bby_8_user u, bby_8_review  r WHERE r.userID <> ? AND r.songID = ? AND r.userID = u.ID";
  connection.query(sql, [userID, songID], function(err, data, fields) {
    if (err) throw err;
    if (data.length > 0) {
      res.setHeader("Content-Type", "application/json");
      res.send(data);
    } else {
      res.setHeader("Content-Type", "application/json");
      res.send({ status: "fail" });
    }
  })
});

app.post("/editReview", function(req, res) {
  var mysql = require("mysql2");
  const connection = isHeroku ? mysql.createConnection({
    host: "ble5mmo2o5v9oouq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "xu76mlcd3o67jwnx",
    password: "xhqasmzcj6v8di7m",
    database: "zyt8w00z5yriluwj",
  }) : mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
  });

  const userID = req.session.number;
  const songID = req.body.song;
  const dateOfReview = req.body.date;
  const review = req.body.review;

  if (review.trim().length <= 0) {
    res.setHeader("Content-Type", "application/json");
    res.send({ status: "fail", msg: "Review can't be empty" });
    return;
  }

  connection.connect();
  var sql = "UPDATE bby_8_review SET dateOfReview = ?, review = ? WHERE userID = ? AND songID = ?";
  connection.query(sql, [dateOfReview, review, userID, songID], function(err, data, fields) {
    if (err) throw err;
    res.setHeader("Content-Type", "application/json");
    res.send({ status: "success" });
  })
});

app.post("/getAllUserReviews", function(req, res) {
  var mysql = require("mysql2");
  const connection = isHeroku ? mysql.createConnection({
    host: "ble5mmo2o5v9oouq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "xu76mlcd3o67jwnx",
    password: "xhqasmzcj6v8di7m",
    database: "zyt8w00z5yriluwj",
  }) : mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
  });

  const userID = req.session.number;

  connection.connect();
  var sql = "SELECT u.userName, s.title, s.filesrc, r.songID, r.review, r.dateOfReview FROM bby_8_user u, bby_8_song s, bby_8_review r WHERE u.ID = r.userID AND s.ID = r.songID AND u.ID = ? order by r.dateOfReview DESC";
  connection.query(sql, [userID], function (err, data, fields) {
    if (err) throw err;
    res.setHeader("Content-Type", "application/json");
    res.send(data);
  })
});

app.post("/deleteReview", function(req, res) {
  var mysql = require("mysql2");
  const connection = isHeroku ? mysql.createConnection({
    host: "ble5mmo2o5v9oouq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "xu76mlcd3o67jwnx",
    password: "xhqasmzcj6v8di7m",
    database: "zyt8w00z5yriluwj",
  }) : mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
  });

  const userID = req.session.number;
  const songID = req.body.song;

  connection.connect();
  var sql = "DELETE FROM bby_8_review WHERE userID = ? AND songID = ?";
  connection.query(sql, [userID, songID], function(err, data, fields) {
    if (err) throw err;
    res.setHeader("Content-Type", "application/json");
    res.send({ status: "success" });
  })
});

app.post("/add-to-library", function(req, res ){
  connection.connect(function(err) {
    var sql = "INSERT INTO bby_8_library (userID, songID) VALUES ('" + req.session.number + "', '" + req.body.songID + "')";
    connection.query(sql, function(err, data, fields) {
      if (err) throw err;
        res.send({status: "success"});
    })
  })
});

app.post("/check-if-in-library", function(req, res ){
  connection.connect(function(err) {
    var sql = "SELECT * FROM bby_8_library WHERE userID = ? AND songID = ?";
    connection.query(sql,[req.session.number, req.body.songID] , function(err, data, fields) {
      if (data.length > 0) {
        res.send({status: "success"});
      } else {
        res.send({status: "fail"});
      }
    })
  })
});

app.post("/get-songs-in-library", function(req, res ){
  connection.connect(function(err) {
    var sql = "SELECT * FROM bby_8_library INNER JOIN bby_8_song ON bby_8_library.songID = bby_8_song.ID WHERE bby_8_library.userID = ?";
    connection.query(sql, req.session.number, function(err, data, fields) {
      if (data.length > 0) {
        res.send({status: "success", rows: data})
      }
    })
  })
});

app.post("/get-new-albums", function(req, res ){
  connection.connect(function(err) {
    var sql = "SELECT * FROM bby_8_album ORDER BY dateOfRelease DESC LIMIT 5";
    connection.query(sql, req.session.number, function(err, data, fields) {
      if (data.length > 0) {
        res.send({status: "success", rows: data})
      }
    })
  })
});

app.post("/get-songs-in-album", function(req, res ){
  connection.connect(function(err) {
    var sql = "SELECT * FROM bby_8_song WHERE album IN (SELECT title FROM bby_8_album WHERE ID = ?)";
    connection.query(sql, req.body.albumID, function(err, data, fields) {
      if (data.length > 0) {
        console.log(data);
        res.send({status: "success", rows: data})
      }
    })
  })
});

app.post("/get-all-songs", function(req, res ){
  connection.connect(function(err) {
    var sql = "SELECT * FROM bby_8_song";
    connection.query(sql, function(err, data, fields) {
      if (err) throw err;
        res.send({status: "success", rows: data});
    })
  })
});

app.post("/newPost", upload.array("files"), function(req, res){
  var mysql = require("mysql2");
  const connection = isHeroku ? mysql.createConnection({
    host: "ble5mmo2o5v9oouq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "xu76mlcd3o67jwnx",
    password: "xhqasmzcj6v8di7m",
    database: "zyt8w00z5yriluwj",
  }) : mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
  });

  const userID = req.session.number;
  const dateOfPost = req.body.body[1];
  const text = req.body.body[0];
  const filesrc = req.files[0] ? req.files[0].filename : "default";

  connection.connect();
  if (text.trim().length <= 0){
    res.setHeader("Content-Type", "application/json");
    res.send({status: "fail", msg: "Post can't be empty"});
  } else {
    var sql = "INSERT INTO BBY_8_post (userID, dateOfPost, post, filesrc) VALUES ('" 
        + userID + "', '" + dateOfPost + "', '" + text + "', '" + filesrc + "')";
    connection.query(sql, function (err, result) {
      if (err) throw err;
      res.setHeader("Content-Type", "application/json");
      res.send({ status: "success" });
    })
    connection.end();
    for (let i = 0; i < req.files.length; i++) {
      req.files[i].filename = req.files[i].originalname;
    }
  }
});

app.post("/displayPosts", function(req, res){
  var mysql = require("mysql2");
  const connection = isHeroku ? mysql.createConnection({
    host: "ble5mmo2o5v9oouq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "xu76mlcd3o67jwnx",
    password: "xhqasmzcj6v8di7m",
    database: "zyt8w00z5yriluwj",
  }) : mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
  });

  const userID = req.session.number;

  connection.connect();
  var sql = "SELECT u.userName, p.* FROM bby_8_user u, bby_8_post p WHERE p.userID=? AND u.ID = p.userID order by p.dateOfPost DESC";
  connection.query(sql, [userID], function (err, data, fields) {
    if (err) throw err;
    res.setHeader("Content-Type", "application/json");
    res.send(data);
  })
});

app.post("/editPost", function(req, res){
  var mysql = require("mysql2");
  const connection = isHeroku ? mysql.createConnection({
    host: "ble5mmo2o5v9oouq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "xu76mlcd3o67jwnx",
    password: "xhqasmzcj6v8di7m",
    database: "zyt8w00z5yriluwj",
  }) : mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
  });

  const postID = req.body.postID;
  const dateOfPost = req.body.date;
  const text = req.body.text;
  let filesrc = req.body.filesrc;

  connection.connect();
  var sql = "UPDATE bby_8_post SET dateOfPost=?, post=?, filesrc=? WHERE ID=?";
  connection.query(sql, [dateOfPost, text, filesrc, postID], function (err, data, fields) {
    if (err) throw err;
    res.setHeader("Content-Type", "application/json");
    res.send({status: "success"});
  })
});

app.post("/deletePost", function(req, res){
  var mysql = require("mysql2");
  const connection = isHeroku ? mysql.createConnection({
    host: "ble5mmo2o5v9oouq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "xu76mlcd3o67jwnx",
    password: "xhqasmzcj6v8di7m",
    database: "zyt8w00z5yriluwj",
  }) : mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
  });

  const postID = req.body.postID;

  connection.connect();
  var sql = "DELETE FROM bby_8_post WHERE ID=?";
  connection.query(sql, [postID], function (err, data, fields) {
    if (err) throw err;
    res.setHeader("Content-Type", "application/json");
    res.send({status: "success"});
  })
});

function authenticate(email, pwd, callback) {
  const mysql = require("mysql2");
  const connection = isHeroku ? mysql.createConnection({
    host: "ble5mmo2o5v9oouq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "xu76mlcd3o67jwnx",
    password: "xhqasmzcj6v8di7m",
    database: "zyt8w00z5yriluwj",
  }) : mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
  });
  connection.connect();
  connection.query(
    "SELECT * FROM BBY_8_user WHERE email = ? AND password = ?", [email, pwd],
    function(error, results, fields) {
      // results is an array of records, in JSON format
      // fields contains extra meta data about results

      if (error) {
        throw error;
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
  const connection = isHeroku ? mysql.createConnection({
    host: "ble5mmo2o5v9oouq.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "xu76mlcd3o67jwnx",
    password: "xhqasmzcj6v8di7m",
    database: "zyt8w00z5yriluwj",
  }) : mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp2800",
  });
  connection.connect();
  connection.query(
    "SELECT * FROM BBY_8_user WHERE role = ?", [userType],
    function(error, results, fields) {
      // results is an array of records, in JSON format
      // fields contains extra meta data about results
      if (error) {
        throw error;
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
let port = process.env.PORT || 8000;
app.listen(port);
console.log("Listening on port " + port + "!");