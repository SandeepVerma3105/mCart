const express = require("express")
const Router = express.Router()
const customerRoutes = require("./customer/index")

Router.use("/", customerRoutes)

module.exports = Router