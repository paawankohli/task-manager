const mongoose = require("mongoose")

const TaskSchema = new mongoose.Schema({
 
    title: {
        type: String,
        required: true,
        default: "",
        trim: true
    },

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