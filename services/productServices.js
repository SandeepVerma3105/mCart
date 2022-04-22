const { ProductModel } = require("../models/product")
const { MerchantModel } = require("../models/merchant")
const { MerchantAddressModel } = require("../models/merchantAddress")
const { CartModel } = require("../models/cart")
const { CustomerMerchantMapping } = require("../models/customerMerchantMapping")
const { MerchantBlockedCustomerModel } = require("../models/merchantBlockedCustomer")
const regex = require("../utils/regex")
const { ObjectId } = require("mongodb/lib/bson")


//query to delete data from collection
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

//query to find data of the respective merchant wich not block the customer
const aggregateQuery = async(data) => {
    console.log("jsfsujhfksjlfhushfsku", data)
    categoryId = data.categoryId
    brandId = data.brandId


    //regex for partial search
    search = new RegExp(data.searchString, 'i')
    try {

        res = await MerchantBlockedCustomerModel.aggregate([
            { $unwind: "$customer" },
            { $addFields: { _id: "$customer._id" } },
            {
                $match: {
                    "customer._id": {
                        $ne: data._id
                    }
                },
            },

            { $project: { merchant: 1, _id: 0 } },

            {
                $lookup: {
                    from: "products",
                    let: { merchantId: "$merchantId", merchant: "$merchant", unit: "$unit", name: "$name" },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$$merchantId", "$merchant"] },
                                    { $eq: ["$isDelete", false] },
                                    { $gte: ["$unit", 1] },
                                ],
                            }
                        }
                    }],
                    as: "product",
                }
            },
            { $unwind: "$product" },
            {
                $match: {
                    $or: [
                        { "product.name": search },
                        { "product.description": search },
                        { "product.categoryId": { $eq: categoryId } },
                        { "product.brandId": brandId }
                    ]
                }
            },
            {
                $sort: {
                    [data.sortKey]: Number(data.order)
                }
            },

            { $project: { product: 1, _id: 0 } },
            {
                '$facet': {
                    metadata: [{ $count: "total" }, { $addFields: { page: data.page || 1 } }],
                    productdata: [{ $skip: Number(data.skip) || 0 }, { $limit: Number(data.limit) || 10 }] // add projection here wish you re-shape the docs
                }
            }

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