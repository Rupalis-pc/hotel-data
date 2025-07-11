const mongoose = require("mongoose");
require("dotenv").config();

const mongoUri = process.env.MONGODB;

async function initialiseDatabase() {
  await mongoose
    .connect(mongoUri)
    .then(() => console.log("Connected to Database"))
    .catch((error) => console.log("Error connecting to Database"));
}

module.exports = { initialiseDatabase };
