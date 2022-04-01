const joi = require("joi")
const pattern = require("../../../utils/regex")
const addProduct = joi.object().keys({
    merchantId: joi.string().required().min(24).max(24),
    categoryId: joi.string().required().min(24).max(24),
    brandName: joi.string().required().regex(pattern.productPattern),
    name: joi.string().min(2).required().regex(pattern.strPattern),
    sortDescription: joi.string().required().min(5).max(100).regex(pattern.productPattern),
    logDescription: joi.string().min(50).regex(pattern.productPattern),
    unit: joi.number().integer().required(),
    baseCost: joi.number().required().min(0),
    discountCost: joi.number().min(0),
    discount: joi.number().min(0),
    size: joi.string().min(1).regex(pattern.size),
    gender: joi.string().min(4).max(5).regex(pattern.strPattern),
    ageGroup: joi.number().min(0),
})

const updateProduct = joi.object().keys({
    categoryId: joi.string().min(24).max(24),
    brandName: joi.string().regex(pattern.productPattern),
    name: joi.string().min(3).regex(pattern.productPattern),
    sortDescription: joi.string().min(10).max(100).regex(pattern.productPattern),
    logDescription: joi.string().min(50).regex(pattern.productPattern),
    unit: joi.number().integer().min(0),
    baseCost: joi.number().min(0),
    discountCost: joi.number().min(0),
    discount: joi.number().min(0),
    size: joi.string().min(1).regex(pattern.size),
    gender: joi.string().min(4).max(5).regex(pattern.strPattern),
    ageGroup: joi.number().min(0),
})

const merchantId = joi.object().keys({
    merchantId: joi.string().min(24).max(24).required()
})


const productId = joi.object().keys({
    productId: joi.string().min(24).max(24).required(),
    merchantId: joi.string().min(24).max(24).required(),
})

const del = joi.object().keys({
    isDelete: joi.boolean().required(),
})

module.exports = {
    addProduct,
    merchantId,
    productId,
    updateProduct,
    del
}