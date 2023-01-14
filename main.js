const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Task  = require('./model/listSchema')
const app = express();
const port = 8081

app.set('view engine','ejs');
app.use(express.urlencoded());
dotenv.config({path:'./config.env'})
//middleware to convert data received from post request to javascript object type
app.use(express.json())
app.use(express.static("static"));
//middle ware to get the routes and make main.js look clean
app.use(require("./routes/auth"));

mongoose.set('strictQuery',false);
const URI = process.env.URI;

async function connectDB()
{
	try{
		await mongoose.connect(URI)
		console.log("Connected to MongoDB")
	}
	catch(error){
		console.log("there is error:",error)
	}
}
connectDB()


/*---------------------------Starting---------------------------------*/




app.listen(port,()=>{
	console.log(`App listening at ${port}`)
})