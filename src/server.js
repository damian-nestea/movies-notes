const express = require("express");
const app = express();

const PORT = 3000;
app.use("/", () => {
  console.log("Listening on port " + PORT);
});
