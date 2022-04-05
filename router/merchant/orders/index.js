const express = require("express")
const route = express.Router()
const orderController = require("./orderController")
const { requestValidator } = require("../../../middleware/request_validator")
const verifyToken = require("../../../middleware/auth")
const orderSchema = require("./orderSchema")

route.get("/orders", verifyToken.verifyToken, orderController.orders)
route.post("/changeOrderStatus", verifyToken.verifyToken, verifyToken.parseJwtMerchent, requestValidator(orderSchema.status), orderController.changeOrederStatus)
route.post("/accept", verifyToken.verifyToken, verifyToken.parseJwtMerchent, requestValidator(orderSchema.orderId), orderController.acceptOrder)
route.get("/orderDetail", verifyToken.verifyToken, verifyToken.parseJwtMerchent, requestValidator(orderSchema.merchantId, "query"), orderController.ordersDetail)
    // route.put("/update", verifyToken.verifyToken, verifyToken.parseJwtMerchent, requestValidator(orderSchema.id, "query"), requestValidator(orderSchema.update), orderController.updateProfile)
    // route.delete("/delete", verifyToken.verifyToken, verifyToken.parseJwtMerchent, requestValidator(orderSchema.id, "query"), requestValidator(orderSchema.del), orderController.updateProfile)

module.exports = route