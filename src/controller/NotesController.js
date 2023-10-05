const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class NotesController {
  async index(request, response) {
    const { user_id, title, tags } = request.query;

    let notes;

    if (tags) {
      const filterTags = tags.split(",").map((tag) => tag.trim());

      notes = await knex("movie_tags")
        .select(["movie_notes.id", "movie_notes.title", "movie_notes.user_id"])
        .where("movie_notes.user_id", user_id)
        .whereLike("movie_notes.title", `%${title}%`)
        .whereIn("name", filterTags)
        .innerJoin("movie_notes", "movie_notes.id", "movie_tags.note_id")
        .orderBy("movie_notes.title");
    } else {
      notes = await knex("movie_notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    }

    const userTags = await knex("movie_tags").where({ user_id });
    const notesWithTags = notes.map((note) => {
      const noteTags = userTags.filter((tag) => tag.note_id === note.id);
      return {
        ...note,
        tags: noteTags,
      };
    });

    return response.json(notesWithTags);
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
