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

router.get("/logout", (req, res) => {
    res.render("logout.hbs")
})

module.exports = router
