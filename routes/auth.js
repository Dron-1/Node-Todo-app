const express = require('express');
const router = express.Router();
const Task = require('../model/listSchema')


router.get('/',(req,res)=>{
    //res.send("hello wordl from auth.js")
	res.render("index");
})

/*------Saving data using Promise------*/
// router.post('/saveTask',(req,res)=>{
//     const { id, title, status, edited } = req.body;
//     if( !id || !title )
//     {
//         return res.status(422).json({error : "Fields were not properly filled"});
//     }

//     const task = new Task(req.body)

//     /*save() return promise and promise is managed using then()-if success and catch()- if failed*/
//     task.save().then(() =>{
//         res.status(201).json({message : "The task was saved in DB successfully"})
//     }).catch(()=>{
//         res.status(500).json({error : "Some error occurs while saving data into DB"});
//     })
 
// })

/*------Saving data using Async/Await------*/
router.post('/save',async(req,res)=>{
    const { id, title, status, editFlag } = req.body;
    
    if( !id || !title )
    {
        return res.status(422).json({error : "Fields were not properly filled"});
    }

    const task = new Task(req.body)

    try{
        const saveTask = await task.save(); 
        if(saveTask)
        {   
            console.log("its saved now");
            res.status(201).json({message : "The task was saved in DB successfully"})
        }
        else{
            res.status(500).json({error : "Some error occurs while saving data into DB"});
        }
    }
    catch(error)
    {
        console.log("Error while adding new task to mongodb------------------------------------",error)
    }
})
    
router.get("/getData", async (req,res)=>{
    try{
        const result  = await Task.find()
        res.end(JSON.stringify(result)); 
	    //console.log(result);
    }
    catch(error){
        console.log("Error while getting data from mongodb---------------------------------",error);
    }
})

//Deleting an object (deleting a document) [any entry in MongoDB is called document]
router.post("/remove/:id",async (req,res)=>{
    try{
        const id = req.params.id;
        //id = JSON.parse(id)
        const targetDocument = await Task.find({id : id}).select("_id")
        const result = await Task.deleteOne({_id : targetDocument})
        res.end("Task has been deleted from MongoDB-------------------------")
    }
    catch(error){
        console.log("Error while Deleting:----------------------------------- ",error);
    }
})

router.post("/update", async (req,res) => {
    try{
        const task = req.body;   
        console.log(task);
        const targetDocument = await Task.find({id : task.id}).select("_id")
        const result = await Task.updateOne( 
            {_id : targetDocument},
            {$set: {
                title : task.title,
                status : task.status,
                editFlag : task.editFlag
            }},
            {new : true}
        )
        console.log("the updated one-------------------",result);
    }
    catch(error){
        console.log("Error while updating Task in mongoDB------------------------------",error);
    }
    
})

module.exports = router;
