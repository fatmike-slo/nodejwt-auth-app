
const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const morgan = require("morgan");
const passport = require("passport");
// db
const Db = require("./db/models/db-users");


const app = express();
// router and routes declaration
const users = require("./routes/users");

// cors middleware
app.use(cors());

// static serving middleware
app.use(express.static(path.join(__dirname, "/public")));

// body parser middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
// passport middleware
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

// morgan dev logger
app.use(morgan("dev"));

//routes
app.use("/users", users);


app.get("/",(req,res)=> {
  res.send("<h1>Hello world</h1>")
});

const port = process.env.PORT || 3000;
const server = app.listen(port,()=> {
  console.log("listening on port ", port);
});