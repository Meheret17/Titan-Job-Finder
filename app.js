const express = require("express");
const mongoose = require("mongoose");
const app = express();
const connectDB = require('./utils/db_connection')

connectDB()

app.use(express.json());

// Your routes will go here
const mainRouter = require('./router/mainRouter')
app.use('/api', mainRouter)


app.get("/status", (req, res) => {
  res.json({ status: "OK" });
});

module.exports = app;
