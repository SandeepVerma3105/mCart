const joi = require("joi")
const pattern = require("../../utils/regex")

const credeintial = joi.object().keys({
    email: joi.string().required().email(),
    password: joi.string().required()
})

const categoryBrand = joi.object().keys({
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

module.exports = {
    categoryBrand,
    credeintial,
    email,
    addMerchant
}