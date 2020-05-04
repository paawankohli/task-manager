const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


const UserSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true,
        trim: true
    },
    
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate (value) {
            if (!validator.isEmail(value)) {
                throw new Error ("Invalid email!")
            }
        }
    },

    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate (value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("Password can't be password")
            }
        }
    },
    
    age: {
        type: Number,
        default: 18,
        validate (value) {
            if (value < 0) {
                throw new Error("Enter positive number")
            }
        }
    },

    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

}, { timestamps: true })



// Function to remove hashed password and tokens array before sending it back to the user 
UserSchema.methods.toJSON = function () {

    console.log("Removing password and tokens array before sending data back...")
    const user = this
    const toSendBack = user.toObject()
    
    delete toSendBack.tokens
    delete toSendBack.password

    console.log("Removed password and tokens array from user object\n")

    return toSendBack
}

// Generate auth token and add it to the database
UserSchema.methods.generateAuthToken = async function () {
    const user = this
    const generatedToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token: generatedToken })
    console.log(`Added a new token to ${user.email}`)
    
    await user.save()

    return generatedToken
}

// find user by credentials and validate password
UserSchema.statics.findByCredentials = async (email, password) => {
    
    const user = await User.findOne({ email: email })
    
    if (!user) {
        console.log("No user not found for the given email")
        throw new Error("User not found")
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        console.log("User with this email exists but invalid password")
        throw new Error("Invalid password")
    }

    console.log("Email and password validated. Generating auth token...")
    return user
}

// Hash the password
UserSchema.pre("save", async function (next) {
    const user = this

    if (user.isModified("password")) {
        console.log("Password was created or changed so hashing it....")
        user.password = await bcrypt.hash(user.password, 8)
    }

    console.log("Saving the updated user to database....")
    next()
})


const Task = require("./task.js")

// Delete all tasks by a user if the user deletes profile (cascade delete)
UserSchema.pre("remove", async function(next) {
    const user = this
    console.log(`Deleted all tasks belonging to ${user.email}.`)
    await Task.deleteMany({ author: user.email })
    next()
})




const User = mongoose.model("User", UserSchema)

module.exports = User