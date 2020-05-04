const express = require("express")
const app = express()
app.use(express.json())

require("./db/mongoose.js")

const userRouter = require("./routers/user.js")
const taskRouter = require("./routers/task.js")

app.use(userRouter)
app.use(taskRouter)

app.get("/", (req, res) => {
    res.send(`Welcome. This is an API. <a href="https://github.com/paawankohli/task-manager">Documentation</a>`)
})


const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Server is up on port ${port}`))