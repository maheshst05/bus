const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();
const  Connection  = require("./db");


var cors = require('cors')
app.use(cors())
const driverRouter = require("./Routes/driverRoute")
const userRouter = require('./Routes/userRouter')
app.use("/user",userRouter)
app.use("/driver",driverRouter)

app.listen(process.env.port, async () => {
  await Connection;
  console.log("Connection established");
  console.log("listening on", process.env.port);
});
