const express = require("express");
const router = express.Router();
const isAdmin = require('../middlewares/isAdmin');

const {
  createDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
} = require("../controllers/workController");

router.post(process.env.WORK_INFO_CREATE_TAIL_URL,isAdmin, createDocument);

router.get(process.env.WORK_INFO_GET_ALL_TAIL_URL, getAllDocuments);

router.get(process.env.WORK_INFO_GET_PUT_DELETE_TAIL_URL, getDocumentById);

router.put(process.env.WORK_INFO_GET_PUT_DELETE_TAIL_URL,isAdmin, updateDocument);

router.delete(process.env.WORK_INFO_GET_PUT_DELETE_TAIL_URL,isAdmin, deleteDocument);

module.exports = router;