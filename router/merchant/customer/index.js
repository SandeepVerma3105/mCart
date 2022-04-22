const express = require("express")
const route = express.Router()
const customerController = require("./customerController")
const { requestValidator } = require("../../../middleware/request_validator")
const verifyToken = require("../../../middleware/auth")
const customerSchema = require("./customerSchema")

/*************************************** merchant / customer APIs ************************************************************** */

route.get("/customers", verifyToken.verifyToken, verifyToken.parseJwtMerchent, customerController.customers)
route.get("/customerById", verifyToken.verifyToken, verifyToken.parseJwtMerchent, customerController.customerDetail)
route.put("/blockCustomer", verifyToken.verifyToken, verifyToken.parseJwtMerchent, requestValidator(customerSchema.customerId), customerController.blockCustomer)
route.get("/blockedCustomerList", verifyToken.verifyToken, verifyToken.parseJwtMerchent, customerController.blockedCustomerList)

/****************************************************************************************************************** */

module.exports = route