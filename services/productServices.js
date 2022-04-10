const { ProductModel } = require("../models/product")
const { MerchantModel } = require("../models/merchant")
const { MerchantAddressModel } = require("../models/merchantAddress")
const { CartModel } = require("../models/cart")


const removeQuery = async(model, data) => {
    console.log("datta", data)
    await model.deleteOne(data)
        .then(async(result) => {
            return result
        }).catch(async(error) => {
            console.log(error)
            return error
        })
}


module.exports = {
    removeQuery
}