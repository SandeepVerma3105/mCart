const { MerchantBlockedCustomerModel } = require("../models/merchantBlockedCustomer")

const updateQuery = async(model, query, data) => {
    console.log(data, query)
    try {
        res = await model.updateOne(query, data, { upsert: true })
        return res
    } catch (error) {
        console.log(error)
        return error
    }
}

module.exports = {
    updateQuery
}