const express = require("express")
const route = express.Router()
const customerController = require("./customerController")
const customerSchema = require("./customerSchema")
const { requestValidator } = require("../../../middleware/request_validator")
const verifyToken = require("../../../middleware/auth")

route.post("/signUp", requestValidator(customerSchema.signUp), customerController.signUp)
route.post("/generateOtp", requestValidator(customerSchema.phoneNumber), customerController.getnerateOTP)
route.post("/signIn", requestValidator(customerSchema.signIn), customerController.signIn)
route.get("/getProduct", verifyToken.verifyToken, verifyToken.parseJwtCustomer, customerController.getProduct)
route.post("/addCart", verifyToken.verifyToken, verifyToken.parseJwtCustomer, requestValidator(customerSchema.addCart), customerController.addCart)
route.post("/placeOrder", verifyToken.verifyToken, verifyToken.parseJwtCustomer, requestValidator(customerSchema.placeOrder), customerController.placeOrder)
route.get("/trackOrder", verifyToken.verifyToken, verifyToken.parseJwtCustomer, requestValidator(customerSchema.customerId, "query"), customerController.trackOrder)
route.get("/orderHistory", verifyToken.verifyToken, verifyToken.parseJwtCustomer, requestValidator(customerSchema.customerId, "query"), customerController.orderHistory)
route.put("/updateUnit", verifyToken.verifyToken, verifyToken.parseJwtCustomer, customerController.updateUnit)

module.exports = route