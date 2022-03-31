const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
    min: 3,
    max: 50,
  },
  model: {
    type: String,
    required: true,
    min: 2,
    max: 50,
  },
  plateNumber: {
    type: String,
    required: true,
    min: 6,
    max: 12,
  },
  category: {
    type: String,
    required: true,
    min: 1,
    max: 3,
  },
  pricePerDay: {
    type: Number,
    required: true,
    min: 2,
    max: 1000,
  },
  rent: {
    type: Boolean,
    required: true,
  },
  location: {
    type: String,
    required: true,
    min: 3,
    max: 30,
  },
});

module.exports = mongoose.model("Car", carSchema);
