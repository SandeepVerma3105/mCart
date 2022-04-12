const { ProductModel } = require("../models/product")
const { MerchantModel } = require("../models/merchant")
const { MerchantAddressModel } = require("../models/merchantAddress")
const { CartModel } = require("../models/cart")
const { CustomerMerchantMapping } = require("../models/customerMerchantMapping")
const { MerchantBlockedCustomerModel } = require("../models/merchantBlockedCustomer")


const removeQuery = async(model, data) => {
    console.log("datta", data)
    try {
        res = await model.deleteOne(data)
        return res

    } catch (error) {
        console.log(error)
        return errory
    }


}

const aggregateQuery = async(data) => {
    console.log(data)
    try {
        res = await MerchantBlockedCustomerModel.aggregate([{
                $match: { "customer._id": { $nin: [data._id] } }
            },
            { $project: { merchant: 1 } },
            {
                $lookup: {
                    from: "products",
                    let: { merchantId: "$merchantId", merchant: "$merchant", unit: "$unit" },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$merchantId", "$$merchant"] },
                                    { $eq: ["$isDelete", false] },
                                    { $gte: ["$unit", 1] },
                                ]
                            }
                        }
                    }],
                    as: "product",
                }
            },
            { $unwind: "$product" },
            { $project: { product: 1, _id: 0 } }
        ])
        return res
    } catch (error) {
        console.log(error)
        return error
    }


}

module.exports = {
    removeQuery,
    aggregateQuery
}