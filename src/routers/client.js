const express = require("express")
const router = new express.Router()

router.get("/", (req, res) => {
    res.render("index.hbs")
})

router.get("/register", (req, res) => {
    res.render("register.hbs")
})

router.get("/login", (req, res) => {
    res.render("login.hbs")
})

router.get("/me", (req, res) => {
    res.render("myProfile.hbs")
})

router.get("/allTasks", (req, res) => {
    res.render("allTasks.hbs")
})

router.get("/oneTask/:id", (req, res) => {
    res.render("oneTask.hbs")
})

router.get("/createTask", (req, res) => {
    res.render("createTask.hbs")
})

router.get("/about", (req, res) => {
    res.render("about.hbs")
})

module.exports = router
