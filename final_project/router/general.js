const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(username && password) {
        if(!isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "Customer successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "Customer already exists!"});
        }
    }
    return res.status(404).json({ message: "Unable to register customer."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    // res.send(books); //Task 1

    // Task 10
    return new Promise((resolve,reject) => {
        resolve(books);
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    // const isbn = req.params.isbn; //Task 2
    // res.send(books[isbn]); //Task 2

    // Task 11
    return new Promise((resolve,reject) => {
        const isbn = req.params.isbn;
        if(books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject({ status: 404, message: `ISBN ${isbn} not found`});
        }
    });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    // Task 3
    // const author = req.params.author;
    // let filtered_books = Object.entries(books)
    //     .filter(([isbn, book]) => book.author === author)
    //     .map(([isbn, book]) => ({
    //         isbn: isbn,
    //         title: book.title,
    //         reviews: book.reviews
    //     }));
    // const response = {
    //     booksByAuthor: filtered_books
    // };
    // res.send(response);


    // Task 12
    return new Promise((resolve,reject) => {
        const author = req.params.author;
        let filtered_books = Object.entries(books)
            .filter(([isbn, book]) => book.author === author);
        if(filtered_books > 0) {
            resolve(filtered_books);
        } else {
            reject("Book not found");
        }
    })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let filtered_books = Object.entries(books)
        .filter(([isbn, book]) => book.title === title)
        .map(([isbn, book]) => ({
            isbn: isbn,
            author: book.author,
            reviews: book.reviews
        }));
    const response = {
        booksByTitle: filtered_books
    };
    res.send(response);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
