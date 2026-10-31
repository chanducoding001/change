const { randomUUID } = require("crypto");
const Book = require("../models/Book");

const createBook = async (req, res) => {
  try {
    const { bookName, aboutBook } = req.body;

    if (!bookName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Book name is required",
      });
    }

    const book = new Book({
      bookId: randomUUID(),
      bookName: bookName.trim(),
      aboutBook: aboutBook?.trim() || "",
      chapters: [],
    });

    await book.save();

    return res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error) {
    console.error("Create book error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create book",
      error: error.message || "Internal server error",
    });
  }
};


const editBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { bookName, aboutBook } = req.body;

    // Validate book ID
    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: "Book ID is required",
      });
    }

    // Validate request body
    if (
      typeof bookName !== "string" ||
      !bookName.trim() ||
      typeof aboutBook !== "string" ||
      !aboutBook.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Book name and About book are required",
      });
    }

    // Find and update book
    const updatedBook = await Book.findOneAndUpdate(
      { bookId },
      {
        $set: {
          bookName: bookName.trim(),
          aboutBook: aboutBook.trim(),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    // Check whether book exists
    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: "Book modified successfully!",
      data: updatedBook,
    });

  } catch (error) {
    console.error("Error updating book:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    // 1. Validate book ID
    if (!bookId || typeof bookId !== "string" || !bookId.trim()) {
      return res.status(400).json({
        success: false,
        message: "Valid Book ID is required",
      });
    }

    // 2. Find and delete book using custom UUID
    const deletedBook = await Book.findOneAndDelete({
      bookId: bookId.trim(),
    });

    // 3. Check whether book exists
    if (!deletedBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // 4. Return success response
    return res.status(200).json({
      success: true,
      message: "Book deleted successfully!",
      data: deletedBook,
    });

  } catch (error) {
    console.error("Error deleting book:", error);

    // 5. Handle unexpected errors
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .select("bookName bookId -_id aboutBook")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.error("Get all books error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch books",
      error: error.message,
    });
  }
};

const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findOne({ bookId:id });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.error("Get book by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch book",
      error: error.message,
    });
  }
};

const modifyChapterInBook = async (req, res) => {
try {
const { id } = req.params;
const { bookId, title, content } = req.body;

// Validate required IDs
if (!id || !bookId) {
  return res.status(400).json({
    success: false,
    message: "Book ID and Chapter ID are required",
  });
}

// Find the book using bookId
const modifyingBook = await Book.findOne({ bookId });

if (!modifyingBook) {
  return res.status(404).json({
    success: false,
    message: "Book not found",
  });
}

// Find the chapter using chapterId (URL id)
const modifyingChapter = modifyingBook.chapters.find(
  (chapter) => chapter.chapterId === id
);

if (!modifyingChapter) {
  return res.status(404).json({
    success: false,
    message: "Chapter not found",
  });
}

// Update chapter fields
if (title !== undefined) {
  modifyingChapter.title = title.trim();
}

if (content !== undefined) {
  modifyingChapter.content = content;
}

// Save updated book
await modifyingBook.save();

return res.status(200).json({
  success: true,
  message: "Chapter updated successfully",
  data: modifyingChapter,
});

} catch (error) {
console.error("Modify chapter error:", error);

return res.status(500).json({
  success: false,
  message: "Failed to update chapter",
  error: error.message || "Internal server error",
});

}
};

const deleteChapterInBook = async (req, res) => {
try {
const { id: chapterId } = req.params;
const { bookId } = req.body;

if (!chapterId || !bookId) {
  return res.status(400).json({
    success: false,
    message: "Book ID and Chapter ID are required",
  });
}

const modifyingBook = await Book.findOne({ bookId });

if (!modifyingBook) {
  return res.status(404).json({
    success: false,
    message: "Book not found",
  });
}

const chapterIndex = modifyingBook.chapters.findIndex(
  (chapter) => chapter.chapterId === chapterId
);

if (chapterIndex === -1) {
  return res.status(404).json({
    success: false,
    message: "Chapter not found",
  });
}

const deletedChapter = modifyingBook.chapters[chapterIndex];

modifyingBook.chapters.splice(chapterIndex, 1);

await modifyingBook.save();

return res.status(200).json({
  success: true,
  message: "Chapter deleted successfully",
  data: deletedChapter,
});

} catch (error) {
console.error("Delete chapter error:", error);

return res.status(500).json({
  success: false,
  message: "Failed to delete chapter",
  error: error.message || "Internal server error",
});

}
};
module.exports = { createBook, getAllBooks, getBookById, modifyChapterInBook, deleteChapterInBook, editBook, deleteBook };
