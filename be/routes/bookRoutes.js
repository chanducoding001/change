const express = require("express");
const {createBook, getAllBooks, getBookById, modifyChapterInBook, deleteChapterInBook} = require("../controllers/bookController");
const { createDocument } = require("../controllers/workController");
const router = express.Router();


router.post(process.env.CREATE_BOOK_TAIL_URL, createBook);
router.post(process.env.CREATE_CHAPTER_TAIL_URL, createDocument);
router.get(process.env.GET_ALL_BOOKS_TAIL_URL, getAllBooks);
router.get(process.env.BOOK_GET_PUT_DELETE_TAIL_URL, getBookById);
router.put(process.env.BOOK_GET_PUT_DELETE_TAIL_URL, modifyChapterInBook);
router.delete(process.env.BOOK_GET_PUT_DELETE_TAIL_URL,deleteChapterInBook)


module.exports = router;
