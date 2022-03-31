const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const {
  registerValidation,
  loginValidation,
  adminRegisterValidation,
  adminLoginValidation,
} = require("./validation");

//-------------------------------------------------------------------------------------------------------------------------------------------------------------
//#region //*USER REGISTRATION
router.get("/registration", (req, res) => {
  res.render("userRegistration.ejs", { error: "" });
});
router.post("/registration", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) {
    return res.render("userRegistration.ejs", { error: error });
  }
  if (req.body.userPassword != req.body.userPassword2) {
    return res.render("userRegistration.ejs", {
      error: "Passwords are not equal",
    });
  }
  //checking if user already exists
  const emailExist = await User.findOne({ email: req.body.email });
  const usernameExist = await User.findOne({
    username: req.body.username,
    role: "user",
  });
  if (emailExist || usernameExist) {
    return res.render("userRegistration.ejs", {
      error: "Username or email already exists!",
    });
  }
  //hashing the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.userPassword, salt);
  //creating new user
  console.log("Registering...");
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    role: "user",
  });

  try {
    const savedUser = await user.save();
    console.log("User added to database");
    const user2 = await User.findOne({ username: req.body.username });
    var userInfo = {
      id: user._id,
      username: req.body.username,
      role: user.role,
    };
    req.session.info = userInfo;
    console.log(req.session);
    res.redirect("../home/search");
  } catch (err) {
    res.status(400).send(err);
  }
});
//#endregion

//#region //*USER LOGIN
router.get("/login", (req, res) => {
  res.render("userLogin.ejs", { error: "" });
});
router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) {
    return res.render("userLogin.ejs", { error: error });
  }
  //checking if user is in databse
  const user = await User.findOne({
    username: req.body.username,
    role: "user",
  });
  console.log(user);
  if (!user) {
    return res.render("userLogin.ejs", {
      error: "Username does not exists!",
    });
  }
  //checking password
  const validPassword = await bcrypt.compare(
    req.body.userPassword,
    user.password
  );
  if (!validPassword) {
    return res.render("userLogin.ejs", {
      error: "Invalid password!",
    });
  }
  var userInfo = { id: user._id, username: req.body.username, role: user.role };
  req.session.info = userInfo;

  console.log(req.session);
  res.redirect("../home/search");
});
//#endregion

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
//#region //*ADMIN REGISTRATION
router.post("/adminregistration", async (req, res) => {
  const { error } = adminRegisterValidation(req.body);
  if (error) {
    return res.render("adminHomePage.ejs");
  }
  if (req.body.adminPassword != req.body.adminPassword2) {
    return res.redirect("../adminhome");
  }
  //checking if admin already in database
  const adminExist = await User.findOne({
    username: req.body.username,
    role: "admin",
  });
  if (adminExist) {
    return res.redirect("../adminhome");
  }
  //hashing the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.adminPassword, salt);
  //creating new admin
  console.log("Processing registration of new admin...");
  console.log(req.body);
  const admin = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    role: "admin",
  });
  try {
    const saveAdmin = await admin.save();
    console.log("New admin added");
    res.redirect("../adminhome");
  } catch (error) {
    res.status(400).send(error);
  }
});
//#endregion

//#region //*ADMIN LOGIN
router.get("/adminlogin", (req, res) => {
  error = "";
  res.render("adminLogin.ejs", { error: error });
});
router.post("/adminlogin", async (req, res) => {
  const { error } = adminLoginValidation(req.body);
  if (error) {
    return res.render("adminLogin.ejs", { error: error });
  }
  //checking if admin exists
  console.log("Checking if admin exists...");
  const adminExist = await User.findOne({
    username: req.body.username,
    role: "admin",
  });
  if (!adminExist) {
    return res.render("adminLogin.ejs", {
      error: "Admin username does not exists!",
    });
  }
  //checking password
  console.log("Checking password...");
  const validPassword = await bcrypt.compare(
    req.body.adminPassword,
    adminExist.password
  );
  if (!validPassword) {
    return res.render("adminLogin.ejs", {
      error: "Invalid password!",
    });
  }
  console.log("Processing admin login...");
  var userInfo = {
    id: adminExist._id,
    username: req.body.username,
    role: adminExist.role,
  };
  req.session.info = userInfo;
  res.redirect("/admin/home");
});
//#endregion

module.exports = router;
