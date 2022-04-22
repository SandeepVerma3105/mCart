const express = require("express")
const route = express.Router()
const customerController = require("./customerController")
const customerSchema = require("./customerSchema")
const { requestValidator } = require("../../../middleware/request_validator")
const verifyToken = require("../../../middleware/auth")

/***************************************Custmer APIs *************************************************************************** */

route.post("/signUp", requestValidator(customerSchema.signUp), customerController.signUp)
route.post("/generateOtp", requestValidator(customerSchema.phoneNumber), customerController.getnerateOTP)
route.post("/signIn", requestValidator(customerSchema.signIn), customerController.signIn)
route.post("/addAddress", verifyToken.verifyToken, verifyToken.parseJwtCustomer, requestValidator(customerSchema.addAddress), customerController.addAddress)
route.get("/address", verifyToken.verifyToken, verifyToken.parseJwtCustomer, customerController.addressList)
route.put("/updateAddress", verifyToken.verifyToken, verifyToken.parseJwtCustomer, requestValidator(customerSchema.addressId, "query"), requestValidator(customerSchema.updateAddress), customerController.updateAddress)
route.get("/getProduct", verifyToken.verifyToken, verifyToken.parseJwtCustomer, customerController.getProduct)
route.post("/addCart", verifyToken.verifyToken, verifyToken.parseJwtCustomer, requestValidator(customerSchema.addCart), customerController.addCart)
route.delete("/removeCart", verifyToken.verifyToken, verifyToken.parseJwtCustomer, requestValidator(customerSchema.productId, "query"), customerController.removeCart)
route.get("/checkCart", verifyToken.verifyToken, verifyToken.parseJwtCustomer, customerController.checkCart)
route.post("/placeOrder", verifyToken.verifyToken, verifyToken.parseJwtCustomer, requestValidator(customerSchema.placeOrder), customerController.placeOrder)
route.get("/trackOrder", verifyToken.verifyToken, verifyToken.parseJwtCustomer, customerController.trackOrder)
route.get("/orderHistory", verifyToken.verifyToken, verifyToken.parseJwtCustomer, customerController.orderHistory)
route.put("/updateUnit", verifyToken.verifyToken, verifyToken.parseJwtCustomer, customerController.updateUnit)
route.get("/category", verifyToken.verifyToken, verifyToken.parseJwtCustomer, customerController.category)
route.get("/brands", verifyToken.verifyToken, verifyToken.parseJwtCustomer, customerController.brands)

/**************************************************************************************************************************************/

module.exports = route