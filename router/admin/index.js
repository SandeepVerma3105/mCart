const express = require("express")
const route = express.Router()
const adminController = require("./admincontroller")
const adminSchema = require("./adminSchema")
const { requestValidator } = require("../../middleware/request_validator")
const verifyToken = require("../../middleware/auth")

route.post("/forgetPassword", requestValidator(adminSchema.email), adminController.forgetPaassword)
route.post("/logIn", requestValidator(adminSchema.credeintial), adminController.Login),
    route.post("/addMerchant", requestValidator(adminSchema.addMerchant), adminController.addMerchant),
    route.post("/category", requestValidator(adminSchema.categoryBrand), adminController.addCategory)
route.post("/brand", requestValidator(adminSchema.categoryBrand), adminController.addBrand)

module.exports = route