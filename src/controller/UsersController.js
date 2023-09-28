const AppError = require("../utils/AppError");

class UsersController {
  create(request, response) {
    const { name, email, password } = request.body;
console.log(name)
    if (!name || !email || !password) {
      throw new AppError("Provide name, email and password");
    }

    return response.json({ message: `User created succesfully` });
  }
}

module.exports = UsersController;
