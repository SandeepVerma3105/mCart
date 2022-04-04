const express = require("express")
const route = express.Router()
const customerController = require("./customerController")
const customerSchema = require("./customerSchema")
const { requestValidator } = require("../../../middleware/request_validator")
const verifyToken = require("../../../middleware/auth")

route.post("/signUp", requestValidator(customerSchema.signUp), customerController.signUp)
route.post("/generateOtp", requestValidator(customerSchema.phoneNumber), customerController.getnerateOTP)
route.post("/signIn", requestValidator(customerSchema.signIn), customerController.signIn),
    route.get("/getProduct", customerController.getProduct)
route.post("/addCart", customerController.addCart),
    route.post("/placeOrder", customerController.placeOrder),
    route.get("/trackOrder", customerController.trackOrder),
    route.get("/orderHistory", customerController.orderHistory),

    module.exports = route