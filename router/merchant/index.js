const express = require("express")
const Router = express.Router()
const productRoutes = require("./product")
const merchantRoutes = require("./merchant")
const orderRoutes = require("./orders")
const customerRouter = require("./customer")

Router.use("/", merchantRoutes)
Router.use("/inventory", productRoutes)
Router.use("/order", orderRoutes)
Router.use("/customer", customerRouter)
module.exports = Router