class UsersController {
  create(request, response) {
    const { id } = request.params;

    return response.json({ message: `User ${id}` });
  }
}

module.exports = UsersController;
