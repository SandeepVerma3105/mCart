const express = require("express")
const route = express.Router()
const orderController = require("./orderController")
const { requestValidator } = require("../../../middleware/request_validator")
const verifyToken = require("../../../middleware/auth")
const orderSchema = require("./orderSchema")

/**************************** merchant/ order APIs ************************************************************************ */

route.get("/orders", verifyToken.verifyToken, verifyToken.parseJwtMerchent, orderController.orders)
route.put("/changeOrderStatus", verifyToken.verifyToken, verifyToken.parseJwtMerchent, requestValidator(orderSchema.status), orderController.changeOrederStatus)
route.put("/accept", verifyToken.verifyToken, verifyToken.parseJwtMerchent, requestValidator(orderSchema.orderId), orderController.acceptOrder)
route.get("/orderDetail", verifyToken.verifyToken, verifyToken.parseJwtMerchent, requestValidator(orderSchema.merchantId, "query"), orderController.ordersDetail)

/**************************************************************************************************************************8*****/


module.exports = route