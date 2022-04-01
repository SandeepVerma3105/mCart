const express = require("express")
const app = express()
const dotenv = require("dotenv").config()
const port = process.env.PORT
const routes = require("./router/index")
const mongoose = require("./config/connection")
const morgan = require("morgan")
const helmet = require("helmet")

app.use(helmet())
app.use(morgan('dev'))

app.use("/dev-api.mcart.com", routes)
app.listen(port, (err) => {
    if (err) throw err
    else {
        console.log("sever running on port:", port)
    }
})