const { Router } = require("express");
const usersRoutes = Router();
const UsersController = require("../controller/UsersController");
const usersController = new UsersController();

usersRoutes.get("/:id", usersController.create);

module.exports = usersRoutes;
