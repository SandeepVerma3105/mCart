const mongoose = require("mongoose")
const { Schema } = require("../config/connection")

const customerMerchantMAppingSchema = mongoose.Schema({
    visted: [{
        merchant: { type: Schema.Types.ObjectId, ref: "merchant" },
        customer: [
            { _id: { type: Schema.Types.ObjectId, ref: "customer" } }
        ]
    }],
})