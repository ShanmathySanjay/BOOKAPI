// in express to implement microservices we get Router - to divide all our routes into different pieces and use them separately
//Prefix : /book
//Initializing Express Router
const Router = require("express").Router();
//Database Models
const BookModel = require("../../database/book");
//GET

/*
Route       -/
Description -get all books
Access      -PUBLIC
Parameter   -NONE
Methods     -GET
*/
Router.get("/",async(req,res)=>{
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);    

});

/*
Route       -/is
Description -get a specific book based on ISBN
Access      -PUBLIC
Parameter   -isbn
Methods     -GET
*/

Router.get("/is/:isbn",async(req,res)=>{
    const getSpecificBook = await BookModel.findOne({ISBN:req.params.isbn});

    if(!getSpecificBook){
        return res.json({
            error: `No book found for the ISBN of ${req.params.isbn}`,
        });
    }
    return res.json({book:getSpecificBook});
    
});

/*
Route       -/c
Description -get a specific book based on category
Access      -PUBLIC
Parameter   -category
Methods     -GET
*/

Router.get("/c/:category",async(req,res)=>{
    const getSpecificBooks = await BookModel.find({category: req.params.category});
    if(!getSpecificBooks){
        return res.json({
            error: `No book found for the category of ${req.params.category}`,
        });
    }
    return res.json({book:getSpecificBooks});
    
});

/*
Route       -/l
Description -get a specific book based on language
Access      -PUBLIC
Parameter   -category
Methods     -GET
*/
Router.get("/l/:lang",async(req,res)=>{
    const getSpecificBooks = await BookModel.find({language:req.params.lang});
     
    if(!getSpecificBooks){
        return res.json({
            error: `No book found in language ${req.params.lang}`,
        });
    }
    return res.json({book:getSpecificBooks});    
});

//POST
// we use request body to get data from the user
//browser can only perform GET request to perform other requests we need HTTP client(helper who helps to make http request/API call) - Postman


/*
Route       -/book/add
Description -add a new book
Access      -PUBLIC
Parameter   -NONE
Methods     -POST
*/
Router.post("/add",async(req,res)=>{
    try{
        const {newBook}=req.body;
        await BookModel.create(newBook);
   
        return res.json({Message:"Book was added!"});
    }catch(error){
        return res.json({Error:error.message});
    }
    
        
});

//PUT
/*
Route       -/book/update/title
Description -update book title
Access      -PUBLIC
Parameter   -isbn
Methods     -PUT
*/
Router.put("/update/title/:isbn",async(req,res)=>{
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN:req.params.isbn
        },
        {
            title:req.body.newBookTitle
        },
        {
            new:true //optional- it will updated in mongodb even if we don't specify this.this is because we need the new updated data to be assigned to the updatedBook constant
        }
    );

    return res.json({Books:updatedBook,Message:"Book Title was updated!"});
});

/*
Route       -/book/update/author
Description -update/add new author
Access      -PUBLIC
Parameter   -isbn,authorid
Methods     -PUT
*/
Router.put("/update/author/:isbn/:authorID",async(req,res)=>{

    //update book database
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN : req.params.isbn
        },
        {
           $addToSet:{
            authors: req.params.authorID,
           }
        },
        {
            new:true
        }
    );

    //database.books.forEach((book)=>{
    //    if(book.ISBN===req.params.isbn){
    //        return book.authors.push(parseInt(req.params.authorID));
    //    }
   // });
    //update author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id:parseInt(req.params.authorID)
        },
        {
            $addToSet:{
                books:req.params.isbn
            }
        },
        {
            new:true
        }
    );
    //database.authors.forEach((author)=>{
    //    if(author.id===parseInt(req.params.authorID)){
    //        return author.books.push(req.params.isbn);
    //    }
   // });
    return res.json({Books:updatedBook,Authors:updatedAuthor,Message:"New author was added!"});
});

//DELETE
/*
Route       -/book/delete
Description -delete a book
Access      -PUBLIC
Parameter   -isbn
Methods     -DELETE
*/
Router.delete("/delete/:isbn",async(req,res)=>{

    const updatedBookDatabase = await BookModel.findOneAndDelete(
    {
        ISBN : req.params.isbn,
    });
    /*const updatedBookDatabase = database.books.filter(
        (book)=> book.ISBN!==req.params.isbn

    );
    database.books = updatedBookDatabase;*/
    return res.json({books : updatedBookDatabase});
});

/*
Route       -/book/delete/author
Description -delete an author from a book
Access      -PUBLIC
Parameter   -isbn, authorID
Methods     -DELETE
*/
Router.delete("/delete/author/:isbn/:authorID",async(req,res)=>{
    //update the book database
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN : req.params.isbn,
        },
        {
            $pull:{
                authors : parseInt(req.params.authorID),
            }
        },
        {
            new:true
        }
    );
    /*database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn)
        {
            const newAuthorList= book.authors.filter(
                (author)=> author!==parseInt(req.params.authorID)
            );
            book.authors=newAuthorList;
            return;
        }
    });*/
    //update the author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id:parseInt(req.params.authorID)
        },
        {
            $pull:{
                books: req.params.isbn
            }
        },
        {
            new:true
        }
    );
    /*database.authors.forEach((author)=>{
        if(author.id===parseInt(req.params.authorID))
        {
            const newBooksList = author.books.filter(
                (book)=> book!==req.params.isbn
            );
            author.books=newBooksList;
            return;
        }
    });*/
    return res.json({Books: updatedBook , Authors:updatedAuthor});
});
module.exports=Router;