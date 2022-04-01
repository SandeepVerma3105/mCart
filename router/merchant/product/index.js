const express = require("express")
const route = express.Router()
const productController = require("./productController")
const productSchema = require("./productSchema")
const { requestValidator } = require("../../../middleware/request_validator")
const verifyToken = require("../../../middleware/auth")

route.get("/category", verifyToken.verifyToken, verifyToken.parseJwtMerchent, productController.category)
route.get("/brands", verifyToken.verifyToken, verifyToken.parseJwtMerchent, productController.brands)
route.post("/product", verifyToken.verifyToken, verifyToken.parseJwtMerchent, requestValidator(productSchema.addProduct), productController.addProduct)
route.get("/product", verifyToken.verifyToken, verifyToken.parseJwtMerchent, productController.getProduct)
route.get("/productByMerchantId", verifyToken.verifyToken, verifyToken.parseJwtMerchent, requestValidator(productSchema.merchantId, "query"), productController.getProduct)
route.get("/productById", verifyToken.verifyToken, verifyToken.parseJwtMerchent, requestValidator(productSchema.productId, "query"), productController.getProduct)
route.put("/product", verifyToken.verifyToken, verifyToken.parseJwtMerchent, requestValidator(productSchema.productId, "query"), requestValidator(productSchema.updateProduct), productController.updateProduct)
route.delete("/product", verifyToken.verifyToken, verifyToken.parseJwtMerchent, requestValidator(productSchema.del), requestValidator(productSchema.productId, "query"), productController.updateProduct)

module.exports = route