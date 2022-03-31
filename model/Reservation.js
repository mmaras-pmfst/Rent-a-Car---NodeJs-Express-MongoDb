const mongoose = require("mongoose");
const { string } = require("@hapi/joi");

const reservationSchema = new mongoose.Schema({
  dateFrom: {
    type: String,
    required: true,
  },
  dateTo: {
    type: String,
    required: true,
  },
  pickUpLocation: {
    type: String,
    required: true,
  },
  dropDownLocation: {
    type: String,
    required: true,
  },
  priceForCar: {
    type: Number,
    required: true,
  },
  extras: {
    type: [String],
    required: false,
  },
  priceForExtras: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  insurance: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
  // car: {
  //   type: String,
  // },
  // user: {
  //   type: String,
  // },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Car",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Reservation", reservationSchema);
