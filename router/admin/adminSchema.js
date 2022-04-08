const joi = require("joi")
const pattern = require("../../utils/regex")

const credeintial = joi.object().keys({
    email: joi.string().required().email(),
    password: joi.string().required()
})

const category = joi.object().keys({
    name: joi.string().required().regex(pattern.strPattern),
    description: joi.string().required().regex(pattern.strPattern)
})
const brand = joi.object().keys({
    categoryId: joi.string().min(24).max(24).required(),
    name: joi.string().required().regex(pattern.strPattern),
    description: joi.string().required().regex(pattern.strPattern)
})

const email = joi.object().keys({
    email: joi.string().required().email()
})

const addMerchant = joi.object().keys({
    email: joi.string().required(),
    firstName: joi.string().required().max(30).regex(pattern.strPattern),
    lastName: joi.string().required().max(30).regex(pattern.strPattern),
})

const block = joi.object().keys({
    id: joi.string().required().min(24).max(24),
    status: joi.boolean().required(),
})

const size = joi.object().keys({
    categoryId: joi.string().min(24).max(24).required(),
    size: joi.string().required(),
})

module.exports = {
    category,
    brand,
    credeintial,
    email,
    addMerchant,
    block,
    size
}