const express = require("express")
const route = express.Router()
const customerController = require("./customerController")
const { requestValidator } = require("../../../middleware/request_validator")
const verifyToken = require("../../../middleware/auth")
const customerSchema = require("./customerSchema")

route.get("/customers", verifyToken.verifyToken, verifyToken.parseJwtMerchent, customerController.customers)
route.get("/customerById", verifyToken.verifyToken, verifyToken.parseJwtMerchent, requestValidator(customerSchema.userId, "query"), customerController.customerDetail)
route.post("/blockCustomer", verifyToken.verifyToken, verifyToken.parseJwtMerchent, requestValidator(customerSchema.status), customerController.blockCustomer)

module.exports = route