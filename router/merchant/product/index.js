const express = require("express")
const route = express.Router()
const productController = require("./productController")
const productSchema = require("./productSchema")
const { requestValidator } = require("../../../middleware/request_validator")
const verifyToken = require("../../../middleware/auth")

/******************************** Merchant/ product APIs ********************************************************************************** */

route.get("/category", verifyToken.verifyToken, verifyToken.parseJwtMerchent, productController.category)
route.get("/brands", verifyToken.verifyToken, verifyToken.parseJwtMerchent, requestValidator(productSchema.categoryId, "query"), productController.brands)
route.get("/size", verifyToken.verifyToken, verifyToken.parseJwtMerchent, requestValidator(productSchema.categoryId, "query"), productController.size)
route.post("/product", verifyToken.verifyToken, verifyToken.parseJwtMerchent, requestValidator(productSchema.addProduct), productController.addProduct)
route.get("/product", verifyToken.verifyToken, verifyToken.parseJwtMerchent, productController.getProduct)
route.get("/productByMerchantId", verifyToken.verifyToken, verifyToken.parseJwtMerchent, requestValidator(productSchema.merchantId, "query"), productController.getProduct)
route.get("/productById", verifyToken.verifyToken, verifyToken.parseJwtMerchent, requestValidator(productSchema.productId, "query"), productController.getProduct)
route.put("/product", verifyToken.verifyToken, verifyToken.parseJwtMerchent, requestValidator(productSchema.productId, "query"), requestValidator(productSchema.updateProduct), productController.updateProduct)
route.delete("/product", verifyToken.verifyToken, verifyToken.parseJwtMerchent, requestValidator(productSchema.del), requestValidator(productSchema.productId, "query"), productController.updateProduct)

/******************************************************************************************************************************************************/

module.exports = route