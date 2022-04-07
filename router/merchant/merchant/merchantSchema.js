const joi = require("joi")
const pattern = require("../../../utils/regex")

const signUp = joi.object().keys({
    firstName: joi.string().min(3).required().regex(pattern.strPattern),
    lastName: joi.string().min(3).required().regex(pattern.strPattern),
    phoneNumber: joi.string().length(10).regex(pattern.mobileNoPattern).required(),
    email: joi.string().email(),
    countryCode: joi.string().max(5).min(2).regex(pattern.conturyCodePatter),
    address: {
        houseNo: joi.string(),
        colony: joi.string().regex(pattern.strPattern),
        landMark: joi.string().regex(pattern.strPattern),
        pinCode: joi.number().required(),
        city: joi.string().regex(pattern.strPattern),
        state: joi.string().required().regex(pattern.strPattern),
        country: joi.string().required().regex(pattern.strPattern),
    },
    password: joi.string().required().regex(pattern.passwordPattern),
    confirmPassword: joi.any().valid(joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } })
})

const update = joi.object().keys({
    firstName: joi.string().min(3).regex(pattern.strPattern),
    lastName: joi.string().min(3).regex(pattern.strPattern),
    phoneNumber: joi.string().length(10).regex(pattern.mobileNoPattern),
    countryCode: joi.string().max(5).min(2).regex(pattern.conturyCodePatter),
})

const addAddress = joi.object().keys({
    houseNo: joi.string().required().regex(pattern.strPattern),
    colony: joi.string().regex(pattern.strPattern),
    landMark: joi.string().regex(pattern.strPattern),
    pinCode: joi.string().required().max(6).min(6).regex(pattern.num),
    city: joi.string().regex(pattern.strPattern),
    state: joi.string().required().regex(pattern.strPattern),
    country: joi.string().required().regex(pattern.strPattern),
})
const id = joi.object().keys({
    id: joi.string().required().min(24).max(24)
})

const logIn = joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().required()
})
const updateIds = joi.object().keys({
    addressId: joi.string().email().required().min(24).max(24),
    merchantId: joi.string().required().min(24).max(24)
})

const del = joi.object().keys({
    isDelete: joi.boolean().required()
})

module.exports = {
    signUp,
    update,
    id,
    logIn,
    del,
    updateIds,
    addAddress
}