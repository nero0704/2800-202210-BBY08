
const express = require("express");
const session = require("express-session");
const app = express();
const fs = require("fs");
const { JSDOM } = require('jsdom');

// static path mappings
app.use("/js", express.static("public/js"));
app.use("/css", express.static("public/css"));
app.use("/img", express.static("public/imgs"));
app.use("/fonts", express.static("public/fonts"));
app.use("/html", express.static("public/html"));
app.use("/media", express.static("public/media"));


app.use(session(
  {
      secret:"extra text that no one will guess",
      name:"wazaSessionID",
      resave: false,
      saveUninitialized: true })
);



app.get("/", function (req, res) {

    if(req.session.loggedIn) {
        if (req.session.role = "A"){
            res.redirect("/admindashboard");
        }
        else{
            res.redirect("/main");
        }
    } else {

        let doc = fs.readFileSync("./public/html/index.html", "utf8");

        res.set("Server", "Wazubi Engine");
        res.set("X-Powered-By", "Wazubi");
        res.send(doc);

    }

});


app.get("/main", function(req, res) {

    // check for a session first!
    if(req.session.loggedIn) {

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
    if(req.session.loggedIn) {

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


    //console.log("What was sent", req.body.email, req.body.password);


    let results = authenticate(req.body.email, req.body.password,
        function(userRecord) {
            //console.log(rows);
            if(userRecord == null) {
                // server couldn't find that, so use AJAX response and inform
                // the user. when we get success, we will do a complete page
                // change. Ask why we would do this in lecture/lab :)
                res.send({ status: "fail", msg: "User account not found." , role: ""});
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
                req.session.save(function(err) {
                });
                res.send({ status: "success", msg: "Logged in.", role: userRecord.role});
            }
    });
});

app.post("/userInfo", function(req, res){
    let results = getUserInfo(req.body.role, function(userRecords){
        res.send(userRecords);
    });
});

app.get("/logout", function(req,res){

    if (req.session) {
        req.session.destroy(function(error) {
            if (error) {
                res.status(400).send("Unable to log out")
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
      database: "COMP2800"
    });
    connection.connect();
    connection.query(
      "SELECT * FROM BBY_8user WHERE email = ? AND password = ?", [email, pwd],
      function(error, results, fields) {
          // results is an array of records, in JSON format
          // fields contains extra meta data about results
          //console.log("Results from DB", results, "and the # of records returned", results.length);

          if (error) {
              // in production, you'd really want to send an email to admin but for now, just console
              console.log(error);
          }
          if(results.length > 0) {
              // email and password found
              return callback(results[0]);
          } else {
              // user not found
              return callback(null);
          }

      }
    );
}

function getUserInfo(userType, callback){
    const mysql = require("mysql2");
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "COMP2800"
    });
    connection.connect();
    connection.query(
        "SELECT * FROM BBY_8user WHERE role = ?", [userType],  
        function(error, results, fields) {
            // results is an array of records, in JSON format
            // fields contains extra meta data about results
    
            if (error) {
                console.log(error);
            }
            if(results.length > 0) {
                return callback(results);
            } else {
                // user not found
                return callback([]);
            }
    
        }
    );
}

// /*
//  * Function that connects to the DBMS and checks if the DB exists, if not
//  * creates it, then populates it with a couple of records. This would be
//  * removed before deploying the app but is great for
//  * development/testing purposes.
//  */
async function init() {
      console.log("Listening on port " + port + "!");
 }

// RUN SERVER
let port = 8000;
app.listen(port, init);
