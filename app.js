const express = require("express");
const mongoose = require("mongoose");

// Connect to the database using the env variables
// change localhost to mongoapp, is the container name where our app will connect
mongoose
  .connect(
    "mongodb://alan:secret@mongoapp:27017/my_database?authSource=admin",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// Define the Book schema
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  published: Date,
  price: Number,
});

const Book = mongoose.model("Book", bookSchema);

// Create an Express app
const app = express();
app.use(express.json());

// Route to create a book
app.get("/create", async (req, res) => {
  const book = new Book({
    title: "Example Book",
    author: "John Doe",
    published: Date.now(),
    price: 9.99,
  });

  await book.save();
  console.log("guardado");
  res.send("Book created");
});

// Route to list all books
app.get("/", async (req, res) => {
  const books = await Book.find().sort("title");
  console.log("listando");
  res.send(books);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
