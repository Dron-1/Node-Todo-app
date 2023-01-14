const mongoose = require("mongoose")

const listSchema = new mongoose.Schema({
    id: {
        type : String,
        required : true
    },
    title: {
        type : String,
        required : true
    },
    status: {
        type : Boolean,
        required : true
    },
    editFlag: {
        type : Boolean,
        required : true
    }
})

//we have created a collection called TASK (in db it will look like tasks )
const Task = mongoose.model('TASK',listSchema);

module.exports = Task;
