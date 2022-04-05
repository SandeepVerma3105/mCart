const joi = require("joi")
const Extension = require('joi-date-extensions');
const Joid = joi.extend(Extension);
const pattern = require("../../../utils/regex")
const paymentDetail = joi.object().keys({
    userId: joi.string().required().min(24).max(24),
    cardNo: joi.string().min(16).max(16).required().regex(pattern.num),
    cardName: joi.string().required().regex(pattern.strPattern),
    cardHolderName: joi.string().required().regex(pattern.strPattern),
    cvvNo: joi.string().max(3).min(3).regex(pattern.cvvPattern),
    expDate: Joid.date().format("MM/YY").greater('now'),
})
const updatePayment = joi.object().keys({
    cardNo: joi.string().min(16).max(16).regex(pattern.cvvPattern),
    cardName: joi.string().regex(pattern.strPattern),
    cardHolderName: joi.string().regex(pattern.strPattern),
    cvvNo: joi.string().max(3).min(3).regex(pattern.cvvPattern),
    expDate: Joid.date().format("MM/YY").greater('now'),
})

const userId = joi.object().keys({
    id: joi.string().min(24).max(24)
})



module.exports = {
    paymentDetail,
    updatePayment,
    userId
}