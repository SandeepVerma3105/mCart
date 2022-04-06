const mongoose = require("mongoose")
const { Schema } = require("../config/connection")


const orderSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    userAddressId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "userAddress"
    },
    productId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "product",
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
        enum: [1, 2, 3, 4, 5],
        default: 1
    },
    transectionStatus: {
        type: Boolean,
        default: false
    },
    paymentKey: {
        type: String
    },
    transectionId: {
        type: String
    },
}, { timestamps: true })

const OrderDetailModel = mongoose.model('orderDetail', orderSchema)
module.exports = {
    OrderDetailModel
}