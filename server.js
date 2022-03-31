const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const http = require("http").Server(app);
// const io = require("socket.io")(http);
const io = require("./io").initialize(http);
const mongoose = require("mongoose");
var session = require("express-session");

//#region //*IMPORT ROUTES
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/app");
const adminRoute = require("./routes/admin");
//#endregion

//#region //*MIDDLEWARE
app.use(express.static("views"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "secret key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use("/user", authRoute);
app.use("/home", userRoute);
app.use("/admin", adminRoute);
//#endregion

app.get("/", (req, res) => {
  res.render("main.ejs");
});

mongoose.connect(
  "mongodb+srv://dev_marko:zavrsni2020@cluster0-m0eke.mongodb.net/Rentacar?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to Database");
  }
);

var server = http.listen(3000, () => {
  console.log("server is running on port", server.address().port);
});
