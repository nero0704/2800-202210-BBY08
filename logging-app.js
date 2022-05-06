const express = require("express");
const session = require("express-session");
const app = express();
const fs = require("fs");
const { connect } = require("http2");
const { JSDOM } = require("jsdom");

// static path mappings
app.use("/js", express.static("public/js"));
app.use("/css", express.static("public/css"));
app.use("/img", express.static("public/img"));
app.use("/fonts", express.static("public/font"));
app.use("/html", express.static("public/html"));
app.use("/media", express.static("public/media"));

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
    if (req.session.role = "A") {
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
    let signupDOM = new JSDOM(signup)
    res.set("Server", "Wazubi Engine");
    res.set("X-Powered-By", "Wazubi");
    res.send(signupDOM.serialize());
  }
});

app.get("/main", function(req, res) {
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

app.get("/admindashboard", function(req, res) {

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Notice that this is a "POST"
app.post("/login", function(req, res) {
  res.setHeader("Content-Type", "application/json");

  console.log("What was sent", req.body.email, req.body.password);

  let results = authenticate(
    req.body.email,
    req.body.password,
    function(userRecord) {
      //console.log(rows);
      if (userRecord == null) {
        // server couldn't find that, so use AJAX response and inform
        // the user. when we get success, we will do a complete page
        // change. Ask why we would do this in lecture/lab :)
        res.send({ status: "fail", msg: "User account not found." });
      } else {
        // authenticate the user, create a session
        req.session.loggedIn = true;
        req.session.email = userRecord.email;
        req.session.firstName = userRecord.firstName;
        req.session.lastName = userRecord.lastName;
        req.session.userName = userRecord.userName;
        req.session.gender = userRecord.gender;
        req.session.age = userRecord.age;
        req.session.role = userRecord.role;
        req.session.save(function(err) {});
        res.send({ status: "success", msg: "Logged in." });
      }
    }
  );
});

app.post('/signup', function(req, res) {

  var mysql = require("mysql2");
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "COMP2800",
  });
  var fname = req.body.fname;
  var lname = req.body.lname;
  var email = req.body.email;
  var password = req.body.password;
  var username = req.body.username;
  var mbti = req.body.mbti;
  var age = req.body.age;

  connection.connect(function(err) {
    if (err) throw err;
    var sql = "SELECT * FROM BBY_8user WHERE email =?";
    connection.query(sql, email, function(err, data, fields) {
      if (err) throw err;
      if (data.length > 1) {
        res.setHeader("Content-Type", "application/json");
        res.send({ status: "fail", msg: "Email already exists." });
      } else {
        var sql = "INSERT INTO BBY_8user (firstName, lastname, email, password, role, userName, age, personality) VALUES ('" + fname + "', '" + lname + "', '" + email + "', '" + password + "', 'R', '" + username + "', '" + age + "', '" + mbti + "')"
        connection.query(sql, function(err, result) {
          if (err) throw err;
          console.log("1 record inserted");
          res.setHeader("Content-Type", "application/json");
          res.send({ status: "success" });
        });
      }
    })
  });
})
app.post("/userInfo", function(req, res) {
  let results = getUserInfo(req.body.role, function(userRecords) {
    res.send(userRecords);
  });
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

function authenticate(email, pwd, callback) {
  const mysql = require("mysql2");
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "COMP2800",
  });
  connection.connect();
  connection.query(
    "SELECT * FROM BBY_8user WHERE email = ? AND password = ?", [email, pwd],
    function(error, results, fields) {
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

// RUN SERVER
let port = 8000;
app.listen(port);
console.log("Listening on port " + port + "!");