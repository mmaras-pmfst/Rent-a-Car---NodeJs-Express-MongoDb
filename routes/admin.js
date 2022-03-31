const router = require("express").Router();
const Car = require("../model/Car");
const Reservation = require("../model/Reservation");
const socket = require("../io").io();

socket.on("connection", () => {
  console.log("Hello there admin");
});

router.get("/home", (req, res) => {
  console.log("session after login: " + req.session.info);
  res.render("adminHomePage.ejs");
});

router.post("/addcar", async (req, res) => {
  console.log(req.body);

  const plateExist = await Car.findOne({
    plateNumber: req.body.plateNumber,
    model: req.body.model,
  });
  if (plateExist) {
    console.log("exists");
    return res.redirect("/admin/home");
  }
  const car = new Car({
    brand: req.body.brand,
    model: req.body.model,
    plateNumber: req.body.plateNumber,
    category: req.body.category,
    pricePerDay: req.body.price,
    rent: false,
    location: req.body.location,
  });
  try {
    const saveCar = await car.save();
    console.log("New car added.");
    socket.emit("plus", car);
    res.redirect("/admin/home");
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/reservationslist", async (req, res) => {
  let populateQuery = [
    { path: "car", select: "plateNumber" },
    { path: "user", select: "username" },
  ];
  let reservation = await Reservation.find({}, "_id active").populate(
    populateQuery
  );
  console.log("this is reservation result:");
  console.log(reservation);
  res.render("reservationsList.ejs", { reservation: reservation });
});

router.get("/reservationdetails", async (req, res) => {
  let reservationId = req.query.id;
  console.log("admin browse reservation: " + reservationId);
  let reservation = await Reservation.find({ _id: reservationId }).populate(
    "car user"
  );
  console.log("This is reservation info: " + reservation);
  res.send(reservation);
});

router.post("/closereservation", async (req, res) => {
  console.log("id of post: " + req.body.id);
  let reservationId = req.body.id;
  let reservationPop = await Reservation.find({ _id: reservationId }).populate(
    "car"
  );
  let reservation = await Reservation.findOne({ _id: reservationId });
  let newLocation = reservationPop[0].dropDownLocation;
  let carId = reservationPop[0].car._id;
  let car = await Car.findOne({ _id: carId });
  console.log("this is the car: " + car);
  const update1 = { active: false };
  const update2 = { rent: false, location: newLocation };
  await reservation.updateOne(update1);
  await car.updateOne(update2);
  socket.emit("plus", car);
  res.sendStatus(200);
});

router.get("/chat", async (req, res) => {
  res.render("chat.ejs");
});

router.get("/logout", async (req, res) => {
  req.session.destroy();

  res.redirect("/");
});
module.exports = router;
