const router = require("express").Router();
const Car = require("../model/Car");
const Reservation = require("../model/Reservation");

const socket = require("../io").io();

socket.on("connection", (soc) => {
  console.log("new user connected");
  soc.on("disconnect", () => {
    console.log("user disconnected");
  });
  soc.on("chat message", (msg) => {
    socket.emit("chat message", msg);
    console.log("message: " + msg);
  });
});

router.get("/search", (req, res) => {
  // console.log("user is: " + req.session.info.username);
  res.render("search.ejs");
});
router.post("/search", async (req, res) => {
  const pickUp = req.body.pickUp;
  const checkIn = req.body.checkin;
  const checkOut = req.body.checkout;
  const dropDown = req.body.dropDown;
  res.redirect(
    `/home/results?pickup=${pickUp}&dropdown=${dropDown}&checkin=${checkIn}&checkout=${checkOut}`
  );
});
router.get("/results", (req, res) => {
  console.log("results pickup is: " + req.query.pickup);
  console.log("results dropdown is: " + req.query.dropdown);
  console.log("results checkin is: " + req.query.checkin);
  console.log("results checkout is: " + req.query.checkout);
  const pickup = req.query.pickup;
  Car.find({ rent: false, location: pickup }, (err, cars) => {
    console.log(cars);
    res.render("resultList.ejs", { location: pickup, cars });
  });
});
router.post("/results", async (req, res) => {
  console.log("Resultat:");
  console.log(req.body);
  const category = req.body.categoryselect;
  const pricePerDay = req.body.pricePerDay;
  const pickup = req.body.pickup;
  const dropdown = req.body.dropdown;
  const checkin = req.body.checkin;
  const checkout = req.body.checkout;
  console.log("category: " + category + " pickup: " + pickup);
  res.send(
    `/home/reservation?category=${category}&price=${pricePerDay}&pickup=${pickup}&dropdown=${dropdown}&checkin=${checkin}&checkout=${checkout}`
  );
});
router.get("/reservation", (req, res) => {
  console.log("reservation page");
  const category = req.query.category;
  const pricePerDay = req.query.price;
  const pickup = req.query.pickup;
  const dropdown = req.query.dropdown;
  const checkin = req.query.checkin;
  const checkout = req.query.checkout;

  res.render("reservation.ejs", {
    category: category,
    pickup: pickup,
    dropdown: dropdown,
    checkin: checkin,
    checkout: checkout,
    price: pricePerDay,
  });
});

router.post("/reservation", async (req, res) => {
  console.log("Reservation details: ");
  console.log(req.body);
  let message = "";

  Car.findOne(
    {
      rent: false,
      location: req.body.pickup,
      category: req.body.category,
    },
    async (err, car) => {
      console.log("car result: " + car);
      if (car == null) {
        message = "failed";
      } else {
        message = "successfull";
        console.log(message);
        let carid = car._id;
        console.log("this is car id: " + carid);
        const reservation = new Reservation({
          dateFrom: req.body.checkin,
          dateTo: req.body.checkout,
          pickUpLocation: req.body.pickup,
          dropDownLocation: req.body.dropdown,
          priceForCar: req.body.priceForCar,
          extras: req.body.extras,
          priceForExtras: req.body.priceForExtras,
          totalPrice: req.body.totalPrice,
          insurance: req.body.insurance,
          active: true,
          car: carid,
          user: req.session.info.id,
        });
        reservation.save();
        let newData = {
          id: reservation._id,
          numberPlate: car.plateNumber,
          username: req.session.info.username,
          active: reservation.active,
        };
        console.log("newdata:");
        console.log(newData);
        const update = { rent: true };
        await car.updateOne(update);
        console.log("updated");
        socket.emit("minus", car);
        socket.emit("plusReservation", newData);
      }
    }
  );

  res.send("Successfull reservation");
});

router.get("/myreservations", async (req, res) => {
  let populateQuery = [{ path: "car", select: "plateNumber brand model" }];
  let reservation = await Reservation.find(
    { user: req.session.info.id },
    "_id active totalPrice"
  ).populate(populateQuery);
  console.log("This are user reservations: ");
  console.log(reservation);
  res.render("myReservations.ejs", { reservation: reservation });
});

router.get("/reservationdetails", async (req, res) => {
  console.log("reservationdetails:");
  console.log(req.query.id);
  let reservationId = req.query.id;
  let reservation = await Reservation.find({ _id: reservationId }).populate(
    "car"
  );
  console.log("this is reservation details: " + reservation);
  res.send(reservation);
});

router.get("/chat", async (req, res) => {
  res.render("chat.ejs");
});

router.get("/logout", async (req, res) => {
  console.log("session before: ");
  console.log(req.session);
  req.session.destroy();
  console.log("session after: ");
  console.log(req.session);
  res.redirect("/");
});

module.exports = router;
