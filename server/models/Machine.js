const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Machine = new Schema({
  macAddress: String,
  cpuLoad: Number,
  osType: String,
  osRelease: String,
  osName: Object,
  osArch: String,
  uptime: Number,
  freeMemory: Number,
  totalMemory: Number,
  memoryUsage: Number,
  cpuModel: String,
  cpuSpeed: Number,
  coreCount: String,
});

module.exports = mongoose.model("Machine", Machine);
