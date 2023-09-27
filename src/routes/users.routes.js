const { Router } = require("express");
const usersRoutes = Router();

usersRoutes.get("/:id", (request, response) => {
  const { id } = request.params;

  return response.json({ message: `User ${id}` });
});

module.exports = usersRoutes;
