const express = require("express")
const route = express.Router()
const adminController = require("./admincontroller")
const adminSchema = require("./adminSchema")
const { requestValidator } = require("../../middleware/request_validator")
const verifyToken = require("../../middleware/auth")

/***************************************************Admin APIs ****************************************************************/
route.post("/forgetPassword", requestValidator(adminSchema.email), adminController.forgetPaassword)
route.post("/logIn", requestValidator(adminSchema.credeintial), adminController.Login)
route.post("/addMerchant", verifyToken.verifyToken, verifyToken.parseJwtAdmin, requestValidator(adminSchema.addMerchant), adminController.addMerchant)
route.post("/category", verifyToken.verifyToken, verifyToken.parseJwtAdmin, requestValidator(adminSchema.category), adminController.addCategory)
route.post("/brand", verifyToken.verifyToken, verifyToken.parseJwtAdmin, requestValidator(adminSchema.brand), adminController.addBrand)
route.post("/size", verifyToken.verifyToken, verifyToken.parseJwtAdmin, requestValidator(adminSchema.size), adminController.size)
route.put("/blockMerchant", verifyToken.verifyToken, verifyToken.parseJwtAdmin, requestValidator(adminSchema.block, "query"), adminController.blockMerchant)

/**************************************************************************************************************************************************************** */
module.exports = route