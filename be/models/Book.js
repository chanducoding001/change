const mongoose = require("mongoose");
const { randomUUID } = require("crypto");

const chapterSchema = new mongoose.Schema(
  {
    chapterId: {
      type: String,
      default: () => randomUUID(),
      immutable: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const bookSchema = new mongoose.Schema(
  {
    bookId: {
      type: String,
      unique: true,
      default: () => randomUUID(),
      immutable: true,
    },
    bookName: {
      type: String,
      required: true,
      trim: true,
    },
    aboutBook: {
      type: String,
      default: "",
      trim: true,
    },
    chapters: {
      type: [chapterSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
