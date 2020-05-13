const express = require("express")
const router = new express.Router()
const mailer = require("../emails/mailer.js")
const User = require("../models/user.js")
const auth = require("../middleware/auth.js")

// ::::::::::::::::::::::::ROUTES USING ASYNC AWAIT:::::::::::::::::::::::::::: 

router.post("/user", async (req, res) => {
    
    try {
        const user = await new User(req.body).save()
        const token = await user.generateAuthToken()
        res.status(201).send({ success: true, user, token })
        mailer.sendWelcomeEmail(user.name, user.email)
    } catch (e) {
        res.status(400).send({ success: false, message: `Unable to create user.` })
    }
})

router.post("/user/login", async (req, res) => {
    
    console.log(req.body.email + " requested to login")
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ success: true, user, token })
    } catch (e) {
        res.status(400).send({ success: false, message: "Invalid credentials" })
    }

})

router.post("/user/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(item => item.token !== req.token)
        await req.user.save()
        console.log("Logged out of current session for " + req.user.email)
        res.status(200).send({ success: true, message: `Logged out of current session for ${req.user.email}` })
    } catch (e) {
        res.status(500).send({ success: false, message: "Unable to log out" })
    }
})

router.post("/user/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        console.log("Logged out of all sessions for " + req.user.email)
        res.status(200).send({ success: true, message: `Logged out of all active sessions for  ${req.user.email}` })
    } catch (e) {
        res.status(500).send({ success: false, message: `Unable to log out` })
    }
})








router.get("/user/me", auth, async (req, res) => {
    res.status(200).send({ success: true, user: req.user })
})

// Only for admins dont include GET /user in production 
router.get("/user", auth, async (req, res) => {
    
    res.status(404).send("This route doesn't exist anymore")
  
    // try {
    //     const u = await User.find({})
    //     res.status(200).send(u)
    // } catch (e) {
    //     res.status(500).send(e)
    // }
})

// Only for admins dont include GET /user/:id in production 
router.get("/user/:id", async (req, res) => {
    
    res.status(404).send("This route doesn't exist anymore")
    
    // try {
    //     const user = await User.findById(req.params.id)
    //     if (!user) {
    //         return res.status(404).send("No such user found")
    //     }
    //     res.status(200).send(user)
    // } catch (e) {
    //     res.status(500).send(e)
    // }
})



router.patch("/user/me", auth, async (req, res) => {
    const toUpdate = Object.keys(req.body)
    const allowedUpdates = ["name", "age", "password"]

    const allowed = toUpdate.every(item => allowedUpdates.includes(item))

    if (!allowed) {
        return res.status(400).send({ success: false, message: "Invalid updates!" })
    }

    try {
        toUpdate.forEach(item => req.user[item] = req.body[item])
        await req.user.save()
        res.status(200).send({ success: true, user: req.user })
    } catch (e) {
        res.status(500).send({ success: false, message: "Some error occured!" })
    }
})


// Only for admins dont include GET /user/:id in production 
router.patch("/user/:id", async (req, res) => {
    
    res.status(404).send("This route doesn't exist anymore")

    // const toUpdate = Object.keys(req.body)
    // const allowedUpdates = ["name", "password", "age"]

    // const allowed = toUpdate.every(item => allowedUpdates.includes(item))

    // if (!allowed) {
    //     return res.status(400).send({ error: "Invalid updates!" })
    // }
    
    // try {
    //     // the following command doesn't run middleware hence changing patch logic
    //     // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        
    //     const user = await User.findById(req.params.id)
    //     if (!user) {
    //         return res.status(404).send("That user didn't exist")
    //     }
    //     toUpdate.forEach(item => user[item] = req.body[item])
        
    //     await user.save()     
    //     res.status(200).send(user)

    // } catch (e) {
    //     res.status(500).send(e)
    // }
})






router.delete("/user/me", auth, async (req, res) => {

    console.log("Recieved request to delete account: " + req.user.email)
    try {

        // old way to remove user from database
        // await User.findOneAndDelete({ email: req.user.email })
        
        // new way to remove user from database
        await req.user.remove()
        
        console.log("Request resolved. Deleted account: " + req.user.email);
        res.status(200).send({ success: true, message: `Your profile has been deleted. Sad to see you go ${req.user.name} :(`})
        mailer.sendLeavingEmail(req.user.name, req.user.email)

    } catch (e) {
        res.status(500).send({ success: false, message: "Unable to delete your profile" })
    }
})

// Only for admins dont include GET /user/:id in production 
router.delete("/user/:id", async (req, res) => {

    res.status(404).send("This route doesn't exist anymore")
    
    // try {
    //     const user = await User.findByIdAndDelete(req.params.id)
    //     if (!user) {
    //         return res.status(404).send("No such user exists")
    //     }
    //     res.status(200).send(user)
    // } catch (e) {
    //     res.status(500).send(e)
    // }
})


module.exports = router