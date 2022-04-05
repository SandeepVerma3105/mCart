const express = require("express")
const route = express.Router()
const paymentController = require("./paymentController")
const paymentSchema = require("./payentSchema")
const { requestValidator } = require("../../../middleware/request_validator")
const verifyToken = require("../../../middleware/auth")

route.post("/addCardDetail", verifyToken.verifyToken, requestValidator(paymentSchema.paymentDetail), paymentController.paymentDetail)
route.get("/cardList", verifyToken.verifyToken, paymentController.paymentList)
route.put("/updateCardDetail", verifyToken.verifyToken, requestValidator(paymentSchema.id, "query"), requestValidator(paymentSchema.updatePayment), paymentController.updatepayment)
route.delete("/deleteCard", verifyToken.verifyToken, requestValidator(paymentSchema.id, "query"), paymentController.deletepayment)
route.post("/makePayment", paymentController.makePayment)
module.exports = route