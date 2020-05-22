const express = require("express")
const router = new express.Router()
const Task = require("../models/task.js")
const auth = require("../middleware/auth.js")


// ::::::::::::::::::::::::ROUTES USING ASYNC AWAIT:::::::::::::::::::::::::::: 

router.post("/task", auth, async (req, res) => {

    console.log(`Creating a new task for ${req.user.email}`)
    const task = new Task({...req.body, author: req.user.email})

    try {
        await task.save()
        res.status(201).send({ success: true, message: 'New task added!', id: task._id})
    } catch (e) {
        res.status(400).send({ success: false, message: 'Error occured! Unable to create task' })
    }

})

// Added ability to find task by completed=true or false. Added limit and page query strings
// Example: GET /task?completed=true&limit=3&page=2
router.get("/task", auth, async (req, res) => {

    const limit = parseInt(req.query.limit || 1000)
    const page = parseInt(req.query.page || 1)

    const filterParamters = { author: req.user.email }
    if (req.query.completed) filterParamters.completed = req.query.completed

    console.log("Search filter is: ", filterParamters)

    try {
        const tasks = await Task.find(filterParamters).skip((page - 1) * limit).limit(limit)
        res.status(200).send({ success: true, tasks })
    } catch (e) {
        res.status(500).send({ success: false, message: `Can't fetch your tasks.` })
    }
})

router.get("/task/:id", auth, async (req, res) => {
    
    try {
        const task = await Task.findOne({ _id: req.params.id, author: req.user.email })
    
        if (!task) {
            console.log("User tried to access a task that does't exist.")
            return res.status(404).send({ success: false, message: "Unable to fetch task" })
        }
        
        console.log("Found task. Sent it to user.")
        res.status(200).send({ success: true, task })
    } catch (e) {
        res.status(500).send({ success: false, message: "Unable to fetch task" })
    }
})

router.patch("/task/:id", auth, async (req, res) => {
    
    const toUpdate = Object.keys(req.body)
    const allowedUpdates = ["title", "description", "completed"]
    const allowed = toUpdate.every(item => allowedUpdates.includes(item))

    if (!allowed) {
        console.log("User tried to edit a field that isn't allowed to be updated")
        return res.status(400).send({ success: false, message: "This update is not allowed." })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, author: req.user.email })
       
        if (!task) {
            console.log("User tried to edit a task that does't exist.")
            return res.status(404).send({ success: false, message: "Task doesn't exist." })
        }

        toUpdate.forEach(item => task[item] = req.body[item])
        await task.save()

        console.log("Task edit complete. Sent to user.")
        res.status(200).send({ success: true, message: "Task updated!" })
        
    } catch (e) {
        res.status(500).send({ success: false, message: "Server error." })
    }
})

router.delete("/task/:id", auth, async (req, res) => {
    
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, author: req.user.email })
        
        if (!task) {
            console.log("User tried to delete a task that does't exist.")
            return res.status(404).send({ success: false, message: "This task doesn't exist." })
        }

        console.log(`Task deleted by ${req.user.email}.`)
        res.status(200).send({ success: true, message: "Task deleted" })
    } catch (e) {
        res.status(500).send({ success: false, message: "server error" })
    }
})


module.exports = router