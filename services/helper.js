const { ProductModel } = require("../models/product")
const { MerchantModel } = require("../models/merchant")
const { MerchantAddressModel } = require("../models/merchantAddress")
const { path } = require("express/lib/application")
const { UserModel } = require("../models/user")
const { OtpModel } = require("../models/otp")
const { CartModel } = require("../models/cart")
const { BrandModel } = require("../models/brand")
    /*
    query to find data based on value, 
    you can sort data based on any field ascending or in decending order
    skip the data as you want or find n'th data
    limit the data 
    total count of data
    */
const findQuery = async(model, data = {}, res) => {
    data.isDelete = false
    if (!data.sortKey && !data.order) {
        sort = {}
    }
    if (data.sortKey && !data.order) {
        sortKey = data.sortKey,
            sort = { sortKey: 1 }
    }
    if (!data.sortKey && data.order) {
        sort = { _id: -1 }
    } else {
        sortKey = data.sortKey,
            order = data.order
        sort = {
            [sortKey]: order
        }
    }
    try {
        res = await model.find(data).skip(data.skip).limit(data.limit).sort(sort).select(["-__v"])
        if (res.length > 0) {
            count = await model.find(data).count()
            res.count = count
            return res
        } else {
            return 0
        }
    } catch (error) {
        return error
    }
}

const insertQuery = async(model, data, res) => {
    try {
        res = await model.insertMany(data)
        if (res.length > 0) {
            return res
        }
    } catch (error) {
        console.log(error)
        return error
    }
}

const updateByIdQuery = async(model, qury, data, res) => {
    try {
        res = await model.findByIdAndUpdate(qury, data)
        if (res == null) {
            return 0
        } else {
            return res
        }
    } catch (error) {
        return error
    }
}

/*
query to find data based on value, also find data from reference table
you can sort data based on any field ascending or in decending order
skip the data as you want or find n'th data
limit the data 
total count of data
*/

const populateQuery = async(model, data, field) => {

    data.isDelete = false
    if (!data.sortKey && !data.order) {
        sort = {}
    }
    if (data.sortKey && !data.order) {
        sortKey = data.sortKey,
            sort = { sortKey: 1 }
    }
    if (!data.sortKey && data.order) {
        sort = { _id: -1 }
    } else {
        sortKey = data.sortKey,
            order = data.order
        sort = {
            [sortKey]: order
        }
    }
    try {
        res = await model.find(data).skip(data.skip).limit(data.limit).sort(sort).populate(field).select(["-__v"])
        if (res.length > 0) {
            count = await model.find(data).count()
            res.count = count
            return res
        } else {
            return 0
        }
    } catch (error) {
        return error
    }
}

const updateQuery = async(model, qury, data, res) => {
    try {
        res = await model.updateOne(qury, data)

        if (res.modifiedCount == 0) {
            return 0
        } else {
            return res
        }
    } catch (error) {
        return error
    }
}

module.exports = {
    findQuery,
    insertQuery,
    updateByIdQuery,
    populateQuery,
    updateQuery

}