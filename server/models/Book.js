const { Schema, model } = require("mongoose");

// https://mongoosejs.com/docs/5.x/docs/models.html
//https://mongoosejs.com/docs/guide.html#definition
const bookSchema = new Schema({
  bookId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  authors: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  link: {
    type: String,
  },
});

const Book = model("Book", bookSchema);

module.exports = {bookSchema, Book};
