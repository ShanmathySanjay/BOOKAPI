const Router = require("express").Router();
const PublicationModel = require("../../database/publication");

//GET

/*
Route       -/publication
Description -get all publications
Access      -PUBLIC
Parameter   -NONE
Methods     -GET
*/
Router.get("/",async(req,res)=>{
    const getAllPublications = await PublicationModel.find();

    return res.json({Publications:getAllPublications});
});

/*
Route       -/publication/id
Description -get specific a publication based on id
Access      -PUBLIC
Parameter   -id
Methods     -GET
*/
Router.get("/id/:id",async (req,res)=>{
    const getSpecificPublication = await PublicationModel.findOne({id:req.params.id});
    if(!getSpecificPublication)
    {
        return res.json({
            error: `No publication found for id ${req.params.id}`,
        });
    }
    return res.json({Publication:getSpecificPublication});
});

/*
Route       -/publication/book
Description -get all publications based on books
Access      -PUBLIC
Parameter   -isbn
Methods     -GET
*/
Router.get("/book/:isbn",async(req,res)=>{
    const getSpecificPublications = await PublicationModel.find({books:req.params.isbn});
    if(!getSpecificPublications){
        return res.json({
            error: `No publication found for the book ${req.params.isbn}`,
        });
    }
    return res.json({Publications:getSpecificPublications});
        
});

//POST

/*
Route       -/publication/add
Description -add a new publication
Access      -PUBLIC
Parameter   -NONE
Methods     -POST
*/
Router.post("/add",async(req,res)=>{
    try{
        const {newPublication}=req.body;
        await PublicationModel.create(newPublication);
    
        return res.json({Message:"Publication was added!"});
    }catch(error){
        return res.json({Error:error.message});
    }

});

//PUT

/*
Route       -/publication/update
Description -update publication name
Access      -PUBLIC
Parameter   -publicationID
Methods     -PUT
*/
Router.put("/update/:publicationID",async(req,res)=>{
    const updatedPublication = await PublicationModel.findOneAndUpdate(
        {
            id:parseInt(req.params.publicationID)
        },
        {
            name:req.body.newPublicationName
        },
        {
            new:true
        }
    );
    return res.json({Publications:updatedPublication,Message:"Publication name updated!"});
});
/*
Route       -/publication/update/book
Description -update/add new book to a publication
Access      -PUBLIC
Parameter   -pubID,isbn
Methods     -PUT
*/
Router.put("/update/book/:pubId/:isbn",async(req,res)=>{
   /* //update the publication database
    database.publications.forEach((publication)=>{
        if(publication.id===req.body.pubID){
            return publication.books.push(req.params.isbn);
        }
    });
    
    //update the book database
    database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn)
        {
            book.publications = req.body.pubID;
            return ;
        }
    });*/
    const updatedPublication = await PublicationModel.findOneAndUpdate(
        {
           id:parseInt(req.params.pubId)
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

    const updateBook = await BookModel.findOneAndUpdate(
        {
            ISBN:req.params.isbn
        },
        {
           publications:parseInt(req.params.pubId)
        },
        {
            new:true
        }
    );
    
    return res.json({Books: updateBook , Publications: updatedPublication});
});

//DELETE

/*
Route       -/publication/delete
Description -delete a publication
Access      -PUBLIC
Parameter   -publicationID
Methods     -DELETE
*/
Router.delete("/delete/:publicationID",async(req,res)=>{
    const updatedPublicationDatabase= await PublicationModel.findOneAndDelete(
        {
            id:parseInt(req.params.publicationID)
        });
    return res.json({Publications:updatedPublicationDatabase});
    
});

/*
Route       -/publication/delete/book
Description -delete a book from publication
Access      -PUBLIC
Parameter   -isbn, publicationID
Methods     -DELETE
*/
Router.delete("/delete/book/:isbn/:pubID",async(req,res)=>{
    //update publications database
   const updatedPublicationDatabase = await PublicationModel.findOneAndUpdate(
       {
           id:parseInt(req.params.pubID)
       },
       {
           $pull:{
               books:req.params.isbn
           }
       },
       {
           new:true
       });
    //update book database
    const updatedBookDatabase = await BookModel.findOneAndUpdate(
        {
            ISBN:req.params.isbn
        },
        {
            
            publications : 0
            
        },{
            new:true
        });

    return res.json({Books : updatedBookDatabase , Publications: updatedPublicationDatabase});
});

module.exports=Router;