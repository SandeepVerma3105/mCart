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
        state: joi.string().required().regex(pattern.strPattern),
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
module.exports = {
    signUp,
    phoneNumber,
    signIn
}