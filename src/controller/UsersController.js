const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");
const { hash, compare } = require("bcryptjs");

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

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const { id } = request.params;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", id);

    if (!user) {
      throw new AppError("User not found");
    }

    const userWithUpdatedEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    console.log(id !== 3);
    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Email already exists in our database");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_password) {
      throw new AppError(
        "Provide both password and old password if you want to update it"
      );
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError("Old password wrong. please try again");
      }

      user.password = await hash(password, 8);
    }

    await database.run(
      "UPDATE users SET name = ?, email = ?,password = ?, updated_at = DATETIME('now', 'localtime') WHERE id = ?",
      [user.name, user.email, user.password, id]
    );

    return response.json({
      message: "User updated successfully",
    });
  }
}

module.exports = UsersController;
