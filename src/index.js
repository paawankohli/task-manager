const express = require("express")
const app = express()
const path = require("path");
const hbs = require("hbs");

require("./db/mongoose.js")

app.use(express.json())
app.use(express.urlencoded({ extended: false }));

// Setup static directory to serve. Public directory contains the static assests.
const publicPath = path.join(__dirname, "..", "public");
app.use(express.static(publicPath));


// Setup handle bars engine. Directory: templates/views and templates/partials
app.set("view engine", "hbs");
const viewsPath = path.join(__dirname, "..", "templates/views");
app.set("views", viewsPath);
const partialsPath = path.join(__dirname, "..", "templates/partials");
hbs.registerPartials(partialsPath);
// console.log(viewsPath, partialsPath);

const userRouter = require("./routers/user.js")
const taskRouter = require("./routers/task.js")
const clientRouter = require("./routers/client.js")

app.use(userRouter)
app.use(taskRouter)
app.use(clientRouter)

app.get("/api", (req, res) => {
    res.send(`Welcome. This is an API. <a href="https://github.com/paawankohli/task-manager">Documentation</a>`)
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server is up on port ${port}`))