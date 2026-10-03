const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(400).json({ message: "Unable to register user. Username and password must be provided." });
});

// Get the book list available in the shop using Promise callbacks
public_users.get('/', function (req, res) {
  const getBooks = new Promise((resolve) => {
    resolve(books);
  });
  getBooks.then((bookList) => {
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  }).catch((err) => {
    return res.status(500).json({ message: "Error retrieving books", error: err });
  });
});

// Get book details based on ISBN using Promise callbacks
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBook = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ status: 404, message: "Book not found" });
    }
  });
  getBook.then((book) => {
    return res.status(200).send(JSON.stringify(book, null, 4));
  }).catch((err) => {
    return res.status(err.status || 500).json({ message: err.message });
  });
});
  
// Get book details based on author using Promise callbacks
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const getBooksByAuthor = new Promise((resolve, reject) => {
    const keys = Object.keys(books);
    let filteredBooks = [];
    keys.forEach((key) => {
      if (books[key].author.toLowerCase() === author.toLowerCase()) {
        filteredBooks.push(books[key]);
      }
    });
    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject({ status: 404, message: "No books found for author: " + author });
    }
  });
  getBooksByAuthor.then((result) => {
    return res.status(200).send(JSON.stringify(result, null, 4));
  }).catch((err) => {
    return res.status(err.status || 500).json({ message: err.message });
  });
});

// Get all books based on title using Promise callbacks
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const getBooksByTitle = new Promise((resolve, reject) => {
    const keys = Object.keys(books);
    let filteredBooks = [];
    keys.forEach((key) => {
      if (books[key].title.toLowerCase() === title.toLowerCase()) {
        filteredBooks.push(books[key]);
      }
    });
    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject({ status: 404, message: "No books found with title: " + title });
    }
  });
  getBooksByTitle.then((result) => {
    return res.status(200).send(JSON.stringify(result, null, 4));
  }).catch((err) => {
    return res.status(err.status || 500).json({ message: err.message });
  });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// ========================================================
// TASK 11 / Course Tasks 10-13: Axios-based Asynchronous Methods
// ========================================================

// Task 10: Get all books using Axios with async/await
const getAllBooksAsync = async (baseURL = 'http://localhost:5000') => {
  try {
    const response = await axios.get(`${baseURL}/`);
    return response.data;
  } catch (error) {
    console.error("Error retrieving all books with Axios:", error.message);
    throw error;
  }
};

// Task 11: Get book details by ISBN using Axios with Promises
const getBookByISBNAsync = (isbn, baseURL = 'http://localhost:5000') => {
  return axios.get(`${baseURL}/isbn/${isbn}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(`Error retrieving book ISBN ${isbn} with Axios:`, error.message);
      throw error;
    });
};

// Task 12: Get book details by Author using Axios with async/await
const getBooksByAuthorAsync = async (author, baseURL = 'http://localhost:5000') => {
  try {
    const response = await axios.get(`${baseURL}/author/${encodeURIComponent(author)}`);
    return response.data;
  } catch (error) {
    console.error(`Error retrieving books by author ${author} with Axios:`, error.message);
    throw error;
  }
};

// Task 13: Get book details by Title using Axios with async/await
const getBooksByTitleAsync = async (title, baseURL = 'http://localhost:5000') => {
  try {
    const response = await axios.get(`${baseURL}/title/${encodeURIComponent(title)}`);
    return response.data;
  } catch (error) {
    console.error(`Error retrieving books by title ${title} with Axios:`, error.message);
    throw error;
  }
};

// Axios-based API endpoints demonstrating async/await and Promises
public_users.get('/async/books', async (req, res) => {
  try {
    const data = await getAllBooksAsync();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

public_users.get('/async/isbn/:isbn', (req, res) => {
  getBookByISBNAsync(req.params.isbn)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(404).json({ error: err.message }));
});

public_users.get('/async/author/:author', async (req, res) => {
  try {
    const data = await getBooksByAuthorAsync(req.params.author);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
});

public_users.get('/async/title/:title', async (req, res) => {
  try {
    const data = await getBooksByTitleAsync(req.params.title);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
});

module.exports.general = public_users;
module.exports.getAllBooksAsync = getAllBooksAsync;
module.exports.getBookByISBNAsync = getBookByISBNAsync;
module.exports.getBooksByAuthorAsync = getBooksByAuthorAsync;
module.exports.getBooksByTitleAsync = getBooksByTitleAsync;
