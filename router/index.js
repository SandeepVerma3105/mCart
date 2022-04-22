const express = require("express")
const Router = express.Router()
const merchantRouters = require("./merchant/index")
const customersRouters = require("./user/index")
const adminRouter = require("./admin/index")
const { verifyRefreshToken } = require("../middleware/auth")
Router.use(express.json())
Router.use(express.urlencoded({ extended: false }))

//routes for all module
Router.use("/merchant", merchantRouters)
Router.use("/customer", customersRouters)
Router.use("/admin", adminRouter)

// api to create a token using refresh token
Router.post("/refreshToken", verifyRefreshToken)
module.exports = Router