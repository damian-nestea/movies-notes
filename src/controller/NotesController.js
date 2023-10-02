const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class NotesController {
  async index(request, response) {
    const { user_id, title } = request.query;

    const notes = await knex("movie_notes")
      .where({ user_id })
      .whereLike("title", `%${title}%`)
      .orderBy("title");

    return response.json(notes);
  }

  async show(request, response) {
    const { id } = request.params;

    const note = await knex("movie_notes").where({ id }).first();

    if (!note) {
      throw new AppError("Note not found");
    }

    const tags = await knex("movie_tags")
      .where({ note_id: id })
      .orderBy("name");

    return response.json({
      ...note,
      tags,
    });
  }

  async create(request, response) {
    const { user_id } = request.params;
    const { title, description, rating, tags } = request.body;

    const userExists = await knex("users").where({ id: user_id });

    if (userExists.length === 0) {
      throw new AppError("User does not exist");
    }

    const [note_id] = await knex("movie_notes").insert({
      title,
      description,
      rating,
      user_id,
    });

    if (tags) {
      const tagsInsert = tags.map((name) => {
        return {
          note_id,
          user_id,
          name,
        };
      });

      await knex("movie_tags").insert(tagsInsert);
    }

    return response.json({ message: "Note created successfully" });
  }

  async delete(request, response) {
    const { id } = request.params;

    const noteExists = await knex("movie_notes").where({ id }).first();

    if (!noteExists) {
      throw new AppError("Note not found");
    }

    await knex("movie_notes").where({ id }).delete();

    return response.json({ message: "Note deleted successfully" });
  }
}

module.exports = NotesController;
