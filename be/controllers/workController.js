const Information = require("../models/Information");
const Work = require("../models/Work");

const models = {
  information: Information,
  work: Work,
};

// CREATE
const createDocument = async (req, res) => {
  try {
    const {  title, content } = req.body;
    const isWork = req.baseUrl.includes("work");
    const Model = isWork ? Work : Information;
    // const Model = models[type];

    if (!Model) {
      return res.status(400).json({
        success: false,
        message: "Invalid type",
      });
    }

    const document = await Model.create({
      title,
      content,
    });

    return res.status(201).json({
      success: true,
      data: document,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL
const getAllDocuments = async (req, res) => {
  try {
    // const { type } = req.params;

    // const Model = models[type];
    const isWork = req.baseUrl.includes("work");
    const Model = isWork ? Work : Information;

    if (!Model) {
      return res.status(400).json({
        success: false,
        message: "Invalid type",
      });
    }

    const documents = await Model.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ONE
const getDocumentById = async (req, res) => {
  try {
    const {  id } = req.params;

    // const Model = models[type];
    const isWork = req.baseUrl.includes("work");
    const Model = isWork ? Work : Information;

    if (!Model) {
      return res.status(400).json({
        success: false,
        message: "Invalid type",
      });
    }

    const document = await Model.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE
const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;

    // const Model = models[type];
    const isWork = req.baseUrl.includes("work");
    const Model = isWork ? Work : Information;

    if (!Model) {
      return res.status(400).json({
        success: false,
        message: "Invalid type",
      });
    }

    const updatedDocument = await Model.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      data: updatedDocument,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE
const deleteDocument = async (req, res) => {
  try {
    const {  id } = req.params;

    // const Model = models[type];
    const isWork = req.baseUrl.includes("work");
    const Model = isWork ? Work : Information;

    if (!Model) {
      return res.status(400).json({
        success: false,
        message: "Invalid type",
      });
    }

    await Model.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
};