const jwt = require("jsonwebtoken")
const User = require("../models/user.js")

const auth = async (req, res, next) => {
    
    console.log("\nAuth middleware running...")

    try {
        const token = req.header("Authorization").replace("Bearer ", "")
        // console.log(token)
        
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        console.log("Token has email: " + decodedToken.email)

        const user = await User.findOne({ email: decodedToken.email, "tokens.token": token })

        if (!user) {
            console.log("User nhi mila with matching email and auth token F\n")
            throw new Error()
        }

        console.log(`Auth check passed for ${user.email}. Access granted to route ${req.method} ${req.url}`)

     
        // Give req the user who is logged in
        req.user = user

        // Give req the token used to login
        req.token = token
     
        next()

    } catch (e) {
        res.status(401).send("You're not authenticated!")
    }
}

module.exports = auth