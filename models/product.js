const { type } = require("express/lib/response")
const mongoose = require("mongoose")
const { Schema } = require("../config/connection")

const productSchema = mongoose.Schema({
    merchantId: {
        type: Schema.Types.ObjectId,
        ref: "merchant"
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "category"
    },
    name: {
        type: String,
        required: true
    },
    brandId: {
        type: Schema.Types.ObjectId,
        ref: "brand"

    },
    sortDescription: {
        type: String,
        required: true
    },
    longDescription: {
        type: String,
    },
    unit: {
        type: Number,
        required: true
    },
    baseCost: {
        type: Number,
        required: true
    },
    discountCost: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    size: {
        type: String,
    },
    gender: {
        type: String,
    },
    ageGroup: {
        type: Number,
    },
    isDelete: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,

    }
}, { timestamps: true })

const ProductModel = mongoose.model("product", productSchema)

module.exports = {
    ProductModel
}