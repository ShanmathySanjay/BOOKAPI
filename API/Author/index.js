const Router = require("express").Router();
const AuthorModel = require("../../database/author");
//GET

/*
Route       -/author
Description -get all authors
Access      -PUBLIC
Parameter   -NONE
Methods     -GET
*/
Router.get("/",async(req,res)=>{
    const getAllAuthors = await AuthorModel.find();
    return res.json({Authors:getAllAuthors});
});
/*
Route       -/author/id
Description -get specific author based on id
Access      -PUBLIC
Parameter   -id
Methods     -GET
*/
Router.get("/id/:id",async (req,res)=>{
    const getSpecificAuthor= await AuthorModel.findOne({id:parseInt(req.params.id)});
    if(!getSpecificAuthor)
    {
        return res.json({
            error: `No author found for id ${req.params.id}`,
        });
    }
    return res.json({author:getSpecificAuthor});
});

/*
Route       -/author/book
Description -get all authors based on books
Access      -PUBLIC
Parameter   -isbn
Methods     -GET
*/
Router.get("/book/:isbn",async(req,res)=>{
    const getSpecificAuthors = await AuthorModel.find({books:req.params.isbn});       
    if(!getSpecificAuthors){
        return res.json({
            error: `No author found for the book ${req.params.isbn}`,
        });
    }
    return res.json({Authors:getSpecificAuthors});
        
});

//POST
//Authors
/*
Route       -/author/add
Description -add a new author
Access      -PUBLIC
Parameter   -NONE
Methods     -POST
*/
Router.post("/add",async(req,res)=>{
    try{
        const {newAuthor}=req.body;

        await AuthorModel.create(newAuthor);
        return res.json({Message:"Author was added!" });   
    }catch(error){
        return res.json({Error:error.message});
    } 
});

//PUT
/*
Route       -/author/update
Description -update author name
Access      -PUBLIC
Parameter   -authorID
Methods     -PUT
*/
Router.put("/update/:authorID",async(req,res)=>{
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id : parseInt(req.params.authorID)
        },
        {
            name : req.body.newName
        },
        {
            new:true
        }
    );
    /* database.authors.forEach((author)=>{
        if(author.id===(parseInt(req.params.authorID)))
        {
            author.name= req.body.newAuthorName;
            return;
        }
    }); */
    return res.json({Authors:updatedAuthor});
});

//DELETE
/*
Route       -/author/delete
Description -delete an author
Access      -PUBLIC
Parameter   -authorID
Methods     -DELETE
*/
Router.delete("/delete/:authorID",async(req,res)=>{
    const updatedAuthorDatabase= await AuthorModel.findOneAndDelete(
    {
        id:parseInt(req.params.authorID)
    }
    );
    return res.json({Authors: updatedAuthorDatabase});

});

module.exports=Router;