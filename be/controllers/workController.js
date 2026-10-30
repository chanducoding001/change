const Book = require("../models/Book");
const Information = require("../models/Information");
const PersonalWork = require("../models/PersonalWork");
const Work = require("../models/Work");

const models = {
  information: Information,
  work: Work,
  personalWork:PersonalWork,
  book:Book
};

// CREATE
// const createDocument = async (req, res) => {
//   try {
//     const {  title, content } = req.body;
//     // const isWork = req.baseUrl.includes("work");
//     // const Model = isWork ? Work : Information;
//     // const Model = models[type];
//      // Get model type from route
//     const type = req.baseUrl.split("/").pop();

//     const Model = models[type];

//     if (!Model) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid type",
//       });
//     }

//     const document = await Model.create({
//       title,
//       content,
//     });

//     return res.status(201).json({
//       success: true,
//       data: document,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const createDocument = async (req, res) => {
  try {
    const { title, content, bookId, bookName } = req.body;

    const type = req.baseUrl.split("/").pop();
    const Model = models[type];

    if (!Model) {
      return res.status(400).json({
        success: false,
        message: "Invalid type",
      });
    }

    // If the model type is book, save the document as a chapter
    if (type === "book") {
      if (!bookId) {
        return res.status(400).json({
          success: false,
          message: "Book ID is required",
        });
      }

      if (!title?.trim()||!content?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Chapter title and content are required",
        });
      }

      const book = await Model.findOne({ bookId });

      if (!book) {
        return res.status(404).json({
          success: false,
          message: "Book not found",
        });
      }

      book.chapters.push({
        title: title.trim(),
        content: content || "",
      });

      await book.save();

      const chapter = book.chapters[book.chapters.length - 1];

      return res.status(201).json({
        success: true,
        message: "Chapter added successfully",
        data: {
          bookId: book.bookId,
          chapter,
        },
      });
    }

    // Default behavior for other models
    const document = await Model.create({
      title,
      content,
    });

    return res.status(201).json({
      success: true,
      data: document,
    });
  } catch (error) {
    console.error("Create document error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
// GET ALL
const getAllDocuments = async (req, res) => {
  try {
    // const { type } = req.params;

    // const Model = models[type];
    // const isWork = req.baseUrl.includes("work");
    // const Model = isWork ? Work : Information;
    const type = req.baseUrl.split("/").pop();

    const Model = models[type];

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
    // const isWork = req.baseUrl.includes("work");
    // const Model = isWork ? Work : Information;
    const type = req.baseUrl.split("/").pop();

    const Model = models[type];

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
    // const isWork = req.baseUrl.includes("work");
    // const Model = isWork ? Work : Information;
    const type = req.baseUrl.split("/").pop();

    const Model = models[type];

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
    // const isWork = req.baseUrl.includes("work");
    // const Model = isWork ? Work : Information;
    const type = req.baseUrl.split("/").pop();

    const Model = models[type];

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