const mongoose = require("mongoose")
const { Schema } = require("../config/connection")

const blockedUserSchema = mongoose.Schema({

    merchant: { type: Schema.Types.ObjectId, ref: "merchant" },
    customer: [
        { _id: { type: Schema.Types.ObjectId, ref: "customer" } }
    ]
})

const MerchantBlockedCustomerModel = mongoose.model("merchantlockedCustomer", blockedUserSchema)

module.exports = {
    MerchantBlockedCustomerModel
}