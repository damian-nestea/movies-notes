const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");
const { hash } = require("bcryptjs");

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      throw new AppError("Provide name, email and password");
    }

    const database = await sqliteConnection();
    const userExists = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (userExists) {
      throw new AppError("Email already exists in database");
    }

    const hashedPassword = await hash(password, 8);

    await database.run(
      "INSERT INTO users (name, email, password) VALUES(?,?,?)",
      [name, email, hashedPassword]
    );

    return response.status(201).json({ message: `User created succesfully` });
  }
}

module.exports = UsersController;
