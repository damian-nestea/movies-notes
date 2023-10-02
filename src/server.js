require("express-async-errors");
const migrationsRun = require("./database/sqlite/migrations");
const express = require("express");
const routes = require("./routes");
const AppError = require("./utils/AppError");

const app = express();

app.use(express.json());
app.use(routes);

migrationsRun();

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
    });
  }
  return response.status(500).json({
    message: "Internal Server Error",
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
