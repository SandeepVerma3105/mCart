const express = require("express")
const Router = express.Router()
const merchantRouters = require("./merchant/index")
const customersRouters = require("./user/index")
Router.use(express.json())
Router.use(express.urlencoded({ extended: false }))

Router.use("/merchant", merchantRouters)
Router.use("/customer", customersRouters)
module.exports = Router