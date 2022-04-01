const express = require("express")
const route = express.Router()
const merchantController = require("./merchantController")
const { requestValidator } = require("../../../middleware/request_validator")
const verifyToken = require("../../../middleware/auth")
const merchantSchema = require("./merchantSchema")

route.post("/register", requestValidator(merchantSchema.signUp), merchantController.signUp)
route.post("/logIn", requestValidator(merchantSchema.logIn), merchantController.Login)
route.get("/profile", verifyToken.verifyToken, verifyToken.parseJwtMerchent, requestValidator(merchantSchema.id, "query"), merchantController.profile)
route.put("/update", verifyToken.verifyToken, verifyToken.parseJwtMerchent, requestValidator(merchantSchema.id, "query"), requestValidator(merchantSchema.update), merchantController.updateProfile)
route.delete("/delete", verifyToken.verifyToken, verifyToken.parseJwtMerchent, requestValidator(merchantSchema.id, "query"), requestValidator(merchantSchema.del), merchantController.updateProfile)

module.exports = route