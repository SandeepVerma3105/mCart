const mongoose = require("mongoose")
const { Schema } = require("../config/connection")


const orderSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    userAddressId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    baseCost: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
    },
    unit: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: Number,
        enum: [{ 1: "pending", 2: "approved", 3: "canceled", 4: "in-transit", 5: "delevered" }],
        default: 1
    },
    transectionStatus: {
        type: Boolean,
        default: false
    },
    transectionId: {
        type: String
    },
}, { timestamps: true })

const OrderDetailModel = mongoose.model('orderDetail', orderSchema)
module.exports = {
    OrderDetailModel
}