const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  busName: {
    type: String,
    required: true,
  },
  driver_name: {
    type: String,
    required: true,
  },
  route: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  sourceRoute: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    latitudeDelta: { type: Number, required: true },
    longitudeDelta: { type: Number, required: true },
  },
  destinationRoute: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    latitudeDelta: { type: Number, required: true },
    longitudeDelta: { type: Number, required: true },
  },
  status: {
    type: String,
    required: true,
  },
});

const BusModel = mongoose.model("bus", busSchema);

module.exports = BusModel;
