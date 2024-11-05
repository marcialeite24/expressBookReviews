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
    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
    });

    get_books.then(() => console.log("Promise for Task 10 resolved"));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    // const isbn = req.params.isbn; //Task 2
    // res.send(books[isbn]); //Task 2

    // Task 11
    const get_books = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        resolve(res.send(books[isbn]));
    });

    get_books.then(() => console.log("Promise for Task 11 resolved"));
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
    const get_books_author = new Promise((resolve, reject) => {
        let booksbyauthor = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
            if(books[isbn]["author"] === req.params.author) {
                booksbyauthor.push({"isbn":isbn,
                "title":books[isbn]["title"],
                "reviews":books[isbn]["reviews"]});
                resolve(res.send(JSON.stringify({booksbyauthor}, null, 4)));
            }    
        });
        reject(res.send("The mentioned author does not exist "))            
    });
    
    get_books_author.then(function(){
        console.log("Promise is resolved");
    }).catch(function () { 
        console.log('The mentioned author does not exist');
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    // Task 4
    // const title = req.params.title;
    // let filtered_books = Object.entries(books)
    //     .filter(([isbn, book]) => book.title === title)
    //     .map(([isbn, book]) => ({
    //         isbn: isbn,
    //         author: book.author,
    //         reviews: book.reviews
    //     }));
    // const response = {
    //     booksByTitle: filtered_books
    // };
    // res.send(response);

    // Task 13
    const get_books_title = new Promise((resolve, reject) => {
        let booksbytitle = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
            if(books[isbn]["title"] === req.params.title) {
                booksbytitle.push({"isbn":isbn,
                "author":books[isbn]["author"],
                "reviews":books[isbn]["reviews"]});
                resolve(res.send(JSON.stringify({booksbytitle}, null, 4)));
            }    
        });
        reject(res.send("The mentioned title does not exist "))            
    });
    
    get_books_title.then(function(){
        console.log("Promise is resolved");
    }).catch(function () { 
        console.log('The mentioned title does not exist');
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
