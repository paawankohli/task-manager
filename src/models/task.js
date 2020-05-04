const mongoose = require("mongoose")

const TaskSchema = new mongoose.Schema({
 
    description: {
        type: String,
        required: true,
        trim: true
    },
 
    completed: {
        type: Boolean,
        default: false
    },

    author: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Task = mongoose.model("Task", TaskSchema)

module.exports = Task