const mongoose = require("mongoose")
const { Schema } = require("../config/connection")

const customerMerchantMAppingSchema = mongoose.Schema({

    merchant: { type: Schema.Types.ObjectId, ref: "merchant" },
    customer: [
        { _id: { type: Schema.Types.ObjectId, ref: "user" } }
    ]
})

const CustomerMerchantMapping = mongoose.model("CustomerMerchantMapping", customerMerchantMAppingSchema)

module.exports = { CustomerMerchantMapping }