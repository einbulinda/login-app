var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var path = require("path");
var session = require("express-session");
const { read } = require("fs");

var app = express();

// setting the view engine
app.set("view engine", "ejs");

// Allowing the node js served pages to use css and js static files
app.use("/public", express.static("public"));

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

var urlencodedParser = bodyParser.urlencoded({ extended: false });

// Routes

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/templates", "register.html"));
});

app.get("/signin", (req, res) => {
  res.sendFile(path.join(__dirname, "/templates", "signin.html"));
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "/templates", "home.html"));
});

// DB Connection to mySQL
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Spectre@7",
  database: "loginapp",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connection to database established");
  /*var sql =
    "CREATE TABLE users (firstName VARCHAR(50), lastName VARCHAR(50), password VARCHAR(50),confirmPassword VARCHAR(50),email VARCHAR(100), gender VARCHAR(100))";
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Users table created");
  });*/
});

app.post("/registerUser", urlencodedParser, (req, res) => {
  // console.log(req.body);
  // check if user exists
  connection.query(
    'select * from users where email="' + req.body.email + '"',
    (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        res.render("userExist", { data: req.body });
      } else {
        // insert vales in DB for the user
        var sql =
          "insert into users (firstName, lastName,password,confirmPassword,email,gender) values('" +
          req.body.firstName +
          "','" +
          req.body.lastName +
          "','" +
          req.body.password +
          "','" +
          req.body.confirmPassword +
          "','" +
          req.body.email +
          "','" +
          req.body.gender +
          "')";
        // check rows affected in operation result
        connection.query(sql, (err, result) => {
          if (err) throw err;
          res.render("regSuccess", { data: req.body });
          console.log("Rows affected: " + result.affectedRows);
        });
      }
    }
  );
});
// Close DB connection
//connection.end();

// creates a server
var PORT = 8085;
app.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
});
