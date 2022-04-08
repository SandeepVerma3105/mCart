const joi = require("joi")
const pattern = require("../../../utils/regex")


const id = joi.object().keys({
    isDelete: joi.boolean().required()
})

const status = joi.object().keys({
    customerId: joi.string().required().max(24).min(24),
    status: joi.number().required().min(0).max(2)
})

const userId = joi.object().keys({
    userId: joi.string().required().max(24).min(24),
})

const customerId = joi.object().keys({
    customerId: joi.string().required().min(24).max(24),
    status: joi.boolean().required()
})

module.exports = {
    id,
    status,
    userId,
    customerId
}