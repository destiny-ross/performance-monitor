require("dotenv").config();
const mongoose = require("mongoose");
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@perfmonitoring.eux4j.mongodb.net/performanceData?retryWrites=true&w=majority`;
mongoose.connect(uri, { useNewUrlParser: true });
const Machine = require("./models/Machine");

const socketMain = (io, socket) => {
  let macAddress;
  // console.log(`Socket ${socket.id} connected`);

  socket.on("clientAuth", (key) => {
    if (key === "i34h5jkbkj3b245jk34b5hj345vn") {
      socket.join("clients");
    } else if (key === "mnxjbiugbug42") {
      socket.join("ui");
      Machine.find({}, (err, docs) => {
        docs.forEach((machine) => {
          machine.isActive = false;
          io.to("ui").emit("data", machine);
        });
      });
    } else {
      socket.disconnect(true);
    }
  });
  socket.on("disconnect", () => {
    Machine.find({ macAddress }, (err, docs) => {
      if (docs.length > 0) {
        // send one last emit to React
        docs[0].isActive = false;
        console.log("isactive", docs[0]);
        io.to("ui").emit("data", docs[0]);
      }
    });
  });

  socket.on("performanceData", (data) => {
    console.log(data);
    io.to("ui").emit("data", data);
  });
  socket.on("initPerformanceData", async (data) => {
    macAddress = data.macAddress;
    const res = await lookupMacAddress(data);
    console.log(res);
  });
};

function lookupMacAddress(data) {
  return new Promise((resolve, reject) => {
    Machine.findOne({ macAddress: data.macAddress }, (err, doc) => {
      if (err) {
        reject(err);
        throw err;
      } else if (doc === null) {
        let newMachine = new Machine(data);
        newMachine.save();
        resolve("added");
      } else {
        resolve("found");
      }
    });
  });
}
module.exports = socketMain;
