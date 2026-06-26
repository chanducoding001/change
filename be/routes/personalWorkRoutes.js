const express = require("express");
const router = express.Router();

const {
  createDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
} = require("../controllers/workController");

router.post(process.env.WORK_INFO_CREATE_TAIL_URL, createDocument);

router.get(process.env.WORK_INFO_GET_ALL_TAIL_URL, getAllDocuments);

router.get(process.env.WORK_INFO_GET_PUT_DELETE_TAIL_URL, getDocumentById);

router.put(process.env.WORK_INFO_GET_PUT_DELETE_TAIL_URL, updateDocument);

router.delete(process.env.WORK_INFO_GET_PUT_DELETE_TAIL_URL, deleteDocument);

module.exports = router;
