const joi = require("joi")
const pattern = require("../../../utils/regex")
const signUp = joi.object().keys({
    firstName: joi.string().min(3).required().regex(pattern.strPattern),
    lastName: joi.string().min(3).required().regex(pattern.strPattern),
    phoneNumber: joi.string().length(10).regex(pattern.mobileNoPattern).required(),
    email: joi.string().email(),
    countryCode: joi.string().max(5).min(2).regex(pattern.conturyCodePatter),
    address: joi.object().required().keys({
        houseNo: joi.string().required(),
        colony: joi.string().regex(pattern.strPattern),
        landMark: joi.string().regex(pattern.strPattern),
        pinCode: joi.number().required(),
        city: joi.string().required().regex(pattern.strPattern),
        state: joi.string().required().regex(pattern.state),
        country: joi.string().regex(pattern.strPattern),
    }),
})

const phoneNumber = joi.object().keys({
    phoneNumber: joi.string().min(10).max(10).regex(pattern.mobileNoPattern)
})

const signIn = joi.object().keys({
    phoneNumber: joi.string().min(10).max(10).regex(pattern.mobileNoPattern),
    otp: joi.string().min(5).max(5).regex(pattern.num)
})

const placeOrder = joi.object().keys({
    userId: joi.string().min(24).max(24).required(),
    productId: joi.string().min(24).max(24).required(),
    unit: joi.number().min(1).required(),
    discount: joi.number().min(0).max(100),
    baseCost: joi.number().min(0).max(100),
    addressId: joi.string().min(24).max(24).required(),
})

const addCart = joi.object().keys({
    userId: joi.string().min(24).max(24).required(),
    productId: joi.string().min(24).max(24).required(),
    unit: joi.number().min(1).required(),
    baseCost: joi.number().min(1).required(),
})

const customerId = joi.object().keys({
    id: joi.string().required().min(24).max(24)
})

const updateUnit = joi.object().keys({
    productId: joi.string().min(24).max(24).required(),
    unit: joi.number().min(1).required(),
})

module.exports = {
    signUp,
    phoneNumber,
    signIn,
    placeOrder,
    addCart,
    customerId,
    updateUnit
}